const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createDoctorSchema = Joi.object({
  // Personal Information
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  
  // Professional Information
  licenseNumber: Joi.string().required(),
  specialization: Joi.string().required(),
  qualification: Joi.string().optional(),
  experience: Joi.number().integer().min(0).optional(),
  consultationFee: Joi.number().min(0).optional(),
  department: Joi.string().optional(),
  designation: Joi.string().optional(),
  medicalDegree: Joi.string().optional(),
  boardCertification: Joi.string().optional(),
  fellowships: Joi.string().optional(),
  licenseExpiryDate: Joi.date().optional(),
  
  // Contact Information
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  country: Joi.string().optional(),
  
  // Emergency Contact Information
  emergencyContactName: Joi.string().optional(),
  emergencyContactPhone: Joi.string().optional(),
  emergencyContactRelationship: Joi.string().optional(),
  
  // Additional Information
  biography: Joi.string().optional(),
  languages: Joi.array().items(Joi.string()).optional(),
  awards: Joi.string().optional(),
  publications: Joi.string().optional(),
  
  // Professional Details
  hospitalAffiliations: Joi.string().optional(),
  insuranceAccepted: Joi.array().items(Joi.string()).optional(),
  joiningDate: Joi.date().optional(),
  
  
  // Availability Information
  availableDays: Joi.array().items(Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')).optional(),
  availableStartTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  availableEndTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  
  // Schedule (optional for creation)
  workingDays: Joi.array().items(Joi.number().min(0).max(6)).optional(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
});

const updateDoctorSchema = Joi.object({
  // Personal Information
  firstName: Joi.any().optional(),
  lastName: Joi.any().optional(),
  email: Joi.any().optional(),
  phone: Joi.any().optional(),
  dateOfBirth: Joi.any().optional(),
  bloodGroup: Joi.any().optional(),
  
  // Professional Information
  specialization: Joi.any().optional(),
  qualification: Joi.any().optional(),
  experience: Joi.any().optional(),
  consultationFee: Joi.any().optional(),
  department: Joi.any().optional(),
  designation: Joi.any().optional(),
  medicalDegree: Joi.any().optional(),
  boardCertification: Joi.any().optional(),
  fellowships: Joi.any().optional(),
  licenseExpiryDate: Joi.any().optional(),
  
  // Contact Information
  address: Joi.any().optional(),
  city: Joi.any().optional(),
  state: Joi.any().optional(),
  zipCode: Joi.any().optional(),
  country: Joi.any().optional(),
  
  // Emergency Contact Information
  emergencyContactName: Joi.any().optional(),
  emergencyContactPhone: Joi.any().optional(),
  emergencyContactRelationship: Joi.any().optional(),
  
  // Additional Information
  biography: Joi.any().optional(),
  languages: Joi.any().optional(),
  awards: Joi.any().optional(),
  publications: Joi.any().optional(),
  
  // Professional Details
  hospitalAffiliations: Joi.any().optional(),
  insuranceAccepted: Joi.any().optional(),
  joiningDate: Joi.any().optional(),
  
  
  // Availability Information
  availableDays: Joi.any().optional(),
  availableStartTime: Joi.any().optional(),
  availableEndTime: Joi.any().optional(),
  
  // Status
  isAvailable: Joi.boolean().optional()
});

// Get all doctors
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', specialization = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { specialization: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        specialization ? { specialization: { contains: specialization, mode: 'insensitive' } } : {}
      ]
    };

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          schedules: true,
          _count: {
            select: {
              appointments: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.doctor.count({ where })
    ]);

    res.json({
      doctors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch doctors'
    });
  }
});

// Get doctor by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true
          }
        },
        schedules: {
          orderBy: { dayOfWeek: 'asc' }
        },
        appointments: {
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
            }
          },
          orderBy: { date: 'desc' },
          take: 10
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Doctor not found'
      });
    }

    res.json({ doctor });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch doctor'
    });
  }
});

// Create new doctor
router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { error, value } = createDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const {
      firstName, lastName, email, phone, dateOfBirth, bloodGroup,
      licenseNumber, specialization, qualification, experience, consultationFee, 
      department, designation, medicalDegree, boardCertification, fellowships, 
      licenseExpiryDate, address, city, state, zipCode, country,
      emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
      biography, languages, awards, publications, hospitalAffiliations, 
      insuranceAccepted, joiningDate,
      availableDays, availableStartTime, availableEndTime,
      workingDays, startTime, endTime
    } = value;

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User with this email already exists'
      });
    }

    // Check if license number already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { licenseNumber }
    });

    if (existingDoctor) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Doctor with this license number already exists'
      });
    }

    // Create user and doctor in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: 'temp123', // Temporary password, should be changed
          firstName,
          lastName,
          phone,
          role: 'DOCTOR'
        }
      });

      // Create doctor profile
      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          licenseNumber,
          specialization,
          qualification,
          experience,
          consultationFee,
          dateOfBirth,
          bloodGroup,
          department,
          designation,
          medicalDegree,
          boardCertification,
          fellowships,
          licenseExpiryDate,
          address,
          city,
          state,
          zipCode,
          country,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelationship,
          biography,
          languages: languages ? JSON.stringify(languages) : null,
          awards,
          publications,
          hospitalAffiliations,
          insuranceAccepted: insuranceAccepted ? JSON.stringify(insuranceAccepted) : null,
          joiningDate,
          availableDays: availableDays ? JSON.stringify(availableDays) : null,
          availableStartTime,
          availableEndTime
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      });

      // Create schedules if provided
      if (workingDays && workingDays.length > 0 && startTime && endTime) {
        const schedules = workingDays.map(dayOfWeek => ({
          doctorId: doctor.id,
          dayOfWeek,
          startTime,
          endTime
        }));

        await tx.doctorSchedule.createMany({
          data: schedules
        });
      }

      return doctor;
    });

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: result
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create doctor'
    });
  }
});

// Update doctor
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Skip validation - accept any data
    const value = req.body;

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingDoctor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Doctor not found'
      });
    }

    // Check authorization
    if (req.user.role === 'DOCTOR' && existingDoctor.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own profile'
      });
    }

    const {
      firstName, lastName, phone, dateOfBirth, bloodGroup, specialization, 
      qualification, experience, consultationFee, department, designation,
      medicalDegree, boardCertification, fellowships, licenseExpiryDate,
      address, city, state, zipCode, country, emergencyContactName, 
      emergencyContactPhone, emergencyContactRelationship, biography, 
      languages, awards, publications, hospitalAffiliations, insuranceAccepted, 
      joiningDate, availableDays, 
      availableStartTime, availableEndTime, isAvailable,
      currentPassword, newPassword
    } = value;

    // Handle password change if provided
    if (newPassword && currentPassword) {
      const bcrypt = require('bcrypt');
      
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingDoctor.user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Current password is incorrect'
        });
      }
    }

    // Update user and doctor in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user data
      const userUpdateData = {};
      if (firstName) userUpdateData.firstName = firstName;
      if (lastName) userUpdateData.lastName = lastName;
      if (phone) userUpdateData.phone = phone;
      
      // Handle password update
      if (newPassword && currentPassword) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userUpdateData.password = hashedPassword;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingDoctor.userId },
          data: userUpdateData
        });
      }

      // Update doctor data
      const doctor = await tx.doctor.update({
        where: { id },
        data: {
          ...(specialization && { specialization }),
          ...(qualification && { qualification }),
          ...(experience !== undefined && { experience }),
          ...(consultationFee !== undefined && { consultationFee }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(bloodGroup && { bloodGroup }),
          ...(department && { department }),
          ...(designation && { designation }),
          ...(medicalDegree && { medicalDegree }),
          ...(boardCertification && { boardCertification }),
          ...(fellowships && { fellowships }),
          ...(licenseExpiryDate && { licenseExpiryDate }),
          ...(address && { address }),
          ...(city && { city }),
          ...(state && { state }),
          ...(zipCode && { zipCode }),
          ...(country && { country }),
          ...(emergencyContactName && { emergencyContactName }),
          ...(emergencyContactPhone && { emergencyContactPhone }),
          ...(emergencyContactRelationship && { emergencyContactRelationship }),
          ...(biography && { biography }),
          ...(languages && { languages: JSON.stringify(languages) }),
          ...(awards && { awards }),
          ...(publications && { publications }),
          ...(hospitalAffiliations && { hospitalAffiliations }),
          ...(insuranceAccepted && { insuranceAccepted: JSON.stringify(insuranceAccepted) }),
          ...(joiningDate && { joiningDate }),
          ...(availableDays && { availableDays: JSON.stringify(availableDays) }),
          ...(availableStartTime && { availableStartTime }),
          ...(availableEndTime && { availableEndTime }),
          ...(isAvailable !== undefined && { isAvailable })
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      });

      return doctor;
    });

    res.json({
      message: 'Doctor updated successfully',
      doctor: result
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update doctor'
    });
  }
});

// Delete doctor
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id }
    });

    if (!doctor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Doctor not found'
      });
    }

    // Delete doctor and associated user
    await prisma.$transaction(async (tx) => {
      await tx.doctor.delete({ where: { id } });
      await tx.user.delete({ where: { id: doctor.userId } });
    });

    res.json({
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete doctor'
    });
  }
});

// Get doctor schedules
router.get('/:id/schedules', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const schedules = await prisma.doctorSchedule.findMany({
      where: { doctorId: id },
      orderBy: { dayOfWeek: 'asc' }
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get doctor schedules error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch doctor schedules'
    });
  }
});

// Update doctor schedules
router.put('/:id/schedules', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { schedules } = req.body;

    // Validate schedules format
    const scheduleSchema = Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.number().min(0).max(6).required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        isActive: Joi.boolean().default(true)
      })
    );

    const { error, value } = scheduleSchema.validate(schedules);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id }
    });

    if (!doctor) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Doctor not found'
      });
    }

    // Check authorization
    if (req.user.role === 'DOCTOR' && doctor.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own schedules'
      });
    }

    // Update schedules in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing schedules
      await tx.doctorSchedule.deleteMany({
        where: { doctorId: id }
      });

      // Create new schedules
      if (value.length > 0) {
        const schedulesData = value.map(schedule => ({
          doctorId: id,
          ...schedule
        }));

        await tx.doctorSchedule.createMany({
          data: schedulesData
        });
      }

      // Return updated schedules
      return await tx.doctorSchedule.findMany({
        where: { doctorId: id },
        orderBy: { dayOfWeek: 'asc' }
      });
    });

    res.json({
      message: 'Doctor schedules updated successfully',
      schedules: result
    });
  } catch (error) {
    console.error('Update doctor schedules error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update doctor schedules'
    });
  }
});

module.exports = router;
