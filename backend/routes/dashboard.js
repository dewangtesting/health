const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get basic counts
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalMedicines,
      todayAppointments,
      monthlyAppointments,
      pendingAppointments,
      completedAppointments,
      lowStockMedicines,
      expiredMedicines
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.medicine.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.appointment.count({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      prisma.appointment.count({
        where: {
          status: 'SCHEDULED'
        }
      }),
      prisma.appointment.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      prisma.medicine.count({
        where: {
          stock: {
            lte: prisma.raw('minStockLevel')
          }
        }
      }),
      prisma.medicine.count({
        where: {
          expiryDate: {
            lt: new Date()
          }
        }
      })
    ]);

    // Get recent activities
    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    // Get appointment status distribution
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get monthly appointment trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await prisma.$queryRaw`
      SELECT 
        strftime('%Y-%m', date) as month,
        COUNT(*) as count
      FROM appointments 
      WHERE date >= ${sixMonthsAgo}
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month
    `;

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalMedicines,
        todayAppointments,
        monthlyAppointments,
        pendingAppointments,
        completedAppointments,
        lowStockMedicines,
        expiredMedicines
      },
      recentAppointments,
      appointmentsByStatus,
      monthlyTrends
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get today's appointments
router.get('/today-appointments', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let where = {
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    };

    // Role-based filtering
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id }
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    } else if (req.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
      });
      if (patient) {
        where.patientId = patient.id;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { time: 'asc' }
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get today appointments error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch today\'s appointments'
    });
  }
});

// Get upcoming appointments (next 7 days)
router.get('/upcoming-appointments', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    let where = {
      date: {
        gte: today,
        lte: nextWeek
      },
      status: {
        in: ['SCHEDULED', 'CONFIRMED']
      }
    };

    // Role-based filtering
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id }
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    } else if (req.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
      });
      if (patient) {
        where.patientId = patient.id;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch upcoming appointments'
    });
  }
});

// Get recent patients
router.get('/recent-patients', authenticateToken, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    res.json({ patients });
  } catch (error) {
    console.error('Get recent patients error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch recent patients'
    });
  }
});

// Get medicine alerts
router.get('/medicine-alerts', authenticateToken, async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [lowStockMedicines, expiredMedicines, expiringSoonMedicines] = await Promise.all([
      prisma.medicine.findMany({
        where: {
          stock: {
            lte: prisma.raw('minStockLevel')
          }
        },
        orderBy: { stock: 'asc' },
        take: 10
      }),
      prisma.medicine.findMany({
        where: {
          expiryDate: {
            lt: new Date()
          }
        },
        orderBy: { expiryDate: 'asc' },
        take: 10
      }),
      prisma.medicine.findMany({
        where: {
          expiryDate: {
            gte: new Date(),
            lte: thirtyDaysFromNow
          }
        },
        orderBy: { expiryDate: 'asc' },
        take: 10
      })
    ]);

    res.json({
      lowStockMedicines,
      expiredMedicines,
      expiringSoonMedicines,
      alerts: {
        lowStock: lowStockMedicines.length,
        expired: expiredMedicines.length,
        expiringSoon: expiringSoonMedicines.length
      }
    });
  } catch (error) {
    console.error('Get medicine alerts error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medicine alerts'
    });
  }
});

module.exports = router;
