const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createAppointmentSchema = Joi.object({
  patientId: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  doctorId: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  duration: Joi.number().integer().min(15).max(180).default(30),
  type: Joi.string().valid('CONSULTATION', 'FOLLOW_UP', 'CHECK_UP', 'EMERGENCY', 'SURGERY').default('CONSULTATION'),
  notes: Joi.string().optional(),
  symptoms: Joi.string().optional()
});

const updateAppointmentSchema = Joi.object({
  date: Joi.date().optional(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  duration: Joi.number().integer().min(15).max(180).optional(),
  type: Joi.string().valid('CONSULTATION', 'FOLLOW_UP', 'CHECK_UP', 'EMERGENCY', 'SURGERY').optional(),
  status: Joi.string().valid('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW').optional(),
  notes: Joi.string().optional(),
  symptoms: Joi.string().optional(),
  diagnosis: Joi.string().optional(),
  prescription: Joi.string().optional()
});

// Get all appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      patientSearch = '',
      createdDate = ''
    } = req.query;
    const skip = (page - 1) * limit;

    console.log('Filter parameters received:', { page, limit, patientSearch, createdDate });

    let where = {};

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

    // Created date filtering - IST timezone handling
    if (createdDate) {
      const { getISTDateRangeUTC } = require('../utils/timezone');
      const { utcStart, utcEnd, istStart, istEnd } = getISTDateRangeUTC(createdDate);
      
      where.createdAt = {
        gte: utcStart,
        lte: utcEnd
      };
      console.log('Created date filter applied (IST):', { 
        originalDate: createdDate,
        istStart: istStart.toISOString(),
        istEnd: istEnd.toISOString(),
        utcStart: utcStart.toISOString(), 
        utcEnd: utcEnd.toISOString(),
        filter: where.createdAt 
      });
    }

    // Patient search - search in firstName, lastName, and patient user names
    if (patientSearch) {
      where.OR = [
        {
          firstName: {
            contains: patientSearch,
            mode: 'insensitive'
          }
        },
        {
          lastName: {
            contains: patientSearch,
            mode: 'insensitive'
          }
        },
        {
          patient: {
            user: {
              OR: [
                {
                  firstName: {
                    contains: patientSearch,
                    mode: 'insensitive'
                  }
                },
                {
                  lastName: {
                    contains: patientSearch,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          }
        }
      ];
      console.log('Patient search filter applied:', { patientSearch, orConditions: where.OR.length });
    }

    console.log('Final where clause:', JSON.stringify(where, null, 2));

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true
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
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      }),
      prisma.appointment.count({ where })
    ]);

    console.log('Query results:', { appointmentsFound: appointments.length, total });

    res.json({
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appointments'
    });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
      });
      if (!patient || appointment.patientId !== patient.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only view your own appointments'
        });
      }
    } else if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id }
      });
      if (!doctor || appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only view your own appointments'
        });
      }
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appointment'
    });
  }
});

// Create new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = createAppointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const { patientId, firstName, lastName, doctorId, date, time, duration, type, notes, symptoms } = value;

    console.log('Appointment creation request:', { 
      patientId, 
      firstName, 
      lastName, 
      doctorId, 
      hasPatientId: !!patientId,
      hasFirstName: !!firstName,
      hasLastName: !!lastName
    });

    let finalPatientId = patientId;

    // If no patientId provided but firstName and lastName are provided, create a new patient
    if (!patientId && firstName && lastName) {
      try {
        // Hash the temporary password
        const bcrypt = require('bcryptjs');
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('temp_password_123', saltRounds);
        
        // Generate unique email to avoid conflicts
        const timestamp = Date.now();
        const uniqueEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@temp.patient.com`;
        
        // Create a new user for the patient with minimal required fields
        const newUser = await prisma.user.create({
          data: {
            email: uniqueEmail, // Unique temporary email
            password: hashedPassword, // Hashed temporary password
            firstName,
            lastName,
            role: 'PATIENT',
            phone: null // Will be set to null
          }
        });

        // Create patient record with minimal required fields
        const newPatient = await prisma.patient.create({
          data: {
            userId: newUser.id,
            dateOfBirth: new Date('1990-01-01'), // Default date - can be updated later
            gender: 'OTHER', // Default gender - can be updated later
            address: null,
            emergencyContactName: null,
            emergencyContactPhone: null,
            medicalHistory: null,
            allergies: null,
            bloodGroup: null,
            admitDate: null,
            admitTime: null,
            notes: null,
            bloodPressure: null,
            weight: null,
            sugarStatus: null,
            sugarLevel: null,
            diabetes: null,
            problem: null,
            diagnosis: null,
            treatmentPlan: null,
            doctorNotes: null,
            labReports: null,
            pastMedicationHistory: null,
            currentMedication: null,
            paymentOption: null,
            hasInsurance: null,
            insuranceNumber: null,
            wardNumber: null,
            doctorId: null,
            advanceAmount: null
          }
        });

        finalPatientId = newPatient.id;
        console.log('Successfully created new patient:', { 
          patientId: newPatient.id, 
          userId: newUser.id, 
          firstName, 
          lastName 
        });
      } catch (createError) {
        console.error('Error creating patient:', createError);
        console.error('Error details:', {
          message: createError.message,
          code: createError.code,
          meta: createError.meta
        });
        return res.status(500).json({
          error: 'Patient Creation Error',
          message: `Failed to create patient record: ${createError.message}`
        });
      }
    } else if (patientId) {
      // Validate patient exists (only if patientId is provided)
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });
      if (!patient) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Patient not found'
        });
      }
    } else {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Either patientId or both firstName and lastName must be provided'
      });
    }

    // Validate doctor exists and is available
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });
    if (!doctor || !doctor.isAvailable) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Doctor not found or not available'
      });
    }

    // Check for conflicting appointments (only if time is provided)
    const appointmentDate = new Date(date);
    if (time) {
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId,
          date: appointmentDate,
          time,
          status: {
            in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
          }
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          error: 'Conflict Error',
          message: 'Doctor already has an appointment at this time'
        });
      }
    }

    // Create appointment
    const appointmentData = {
      patientId: finalPatientId,
      doctorId,
      userId: req.user.id,
      date: appointmentDate,
      duration,
      type,
      notes,
      symptoms
    };

    // Add optional fields
    if (firstName) appointmentData.firstName = firstName;
    if (lastName) appointmentData.lastName = lastName;
    if (time) appointmentData.time = time;

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
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

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
      patientCreated: !patientId && firstName && lastName // Indicate if a new patient was created
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create appointment'
    });
  }
});

// Update appointment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateAppointmentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true
      }
    });

    if (!existingAppointment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
      });
      if (!patient || existingAppointment.patientId !== patient.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only update your own appointments'
        });
      }
    } else if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id }
      });
      if (!doctor || existingAppointment.doctorId !== doctor.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only update your own appointments'
        });
      }
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: value,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
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

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update appointment'
    });
  }
});

// Cancel appointment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (req.user.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id }
      });
      if (!patient || appointment.patientId !== patient.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only cancel your own appointments'
        });
      }
    } else if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id }
      });
      if (!doctor || appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'You can only cancel your own appointments'
        });
      }
    }

    // Update status to cancelled instead of deleting
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to cancel appointment'
    });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/doctor/:doctorId/available-slots', authenticateToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Date is required'
      });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Get doctor's schedule for the day
    const schedule = await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        isActive: true
      }
    });

    if (!schedule) {
      return res.json({
        availableSlots: [],
        message: 'Doctor is not available on this day'
      });
    }

    // Get existing appointments for the date
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: targetDate,
          lt: nextDay
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        }
      },
      select: {
        time: true,
        duration: true
      }
    });

    // Generate available slots
    const availableSlots = generateAvailableSlots(
      schedule.startTime,
      schedule.endTime,
      existingAppointments,
      30 // default slot duration
    );

    res.json({
      availableSlots,
      schedule: {
        startTime: schedule.startTime,
        endTime: schedule.endTime
      }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch available slots'
    });
  }
});

// Helper function to generate available time slots
function generateAvailableSlots(startTime, endTime, existingAppointments, slotDuration) {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  for (let time = start; time < end; time += slotDuration) {
    const timeStr = minutesToTime(time);
    const isBooked = existingAppointments.some(apt => {
      const aptStart = timeToMinutes(apt.time);
      const aptEnd = aptStart + apt.duration;
      return time >= aptStart && time < aptEnd;
    });

    if (!isBooked) {
      slots.push(timeStr);
    }
  }

  return slots;
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

module.exports = router;
