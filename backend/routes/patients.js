const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Schema without validation - all fields optional
const createPatientSchema = Joi.object({
  // Basic Information
  firstName: Joi.any().optional(),
  lastName: Joi.any().optional(),
  email: Joi.any().optional(),
  phone: Joi.any().optional(),
  dateOfBirth: Joi.any().optional(),
  gender: Joi.any().optional(),
  address: Joi.any().optional(),
  emergencyContactName: Joi.any().optional(),
  emergencyContactPhone: Joi.any().optional(),
  medicalHistory: Joi.any().optional(),
  allergies: Joi.any().optional(),
  bloodGroup: Joi.any().optional(),
  
  // Admission Information
  admitDate: Joi.any().optional(),
  admitTime: Joi.any().optional(),
  notes: Joi.any().optional(),
  
  // Medical Information
  bloodPressure: Joi.any().optional(),
  weight: Joi.any().optional(),
  sugarStatus: Joi.any().optional(),
  sugarLevel: Joi.any().optional(),
  diabetes: Joi.any().optional(),
  problem: Joi.any().optional(),
  diagnosis: Joi.any().optional(),
  treatmentPlan: Joi.any().optional(),
  doctorNotes: Joi.any().optional(),
  labReports: Joi.any().optional(),
  pastMedicationHistory: Joi.any().optional(),
  currentMedication: Joi.any().optional(),
  
  // Registration Information
  paymentOption: Joi.any().optional(),
  hasInsurance: Joi.any().optional(),
  insuranceNumber: Joi.any().optional(),
  wardNumber: Joi.any().optional(),
  doctorId: Joi.any().optional(),
  advanceAmount: Joi.any().optional()
});

// Remove validation schema completely - not needed
// const updatePatientSchema = Joi.object({}).unknown(true);

// Get all patients
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'DOCTOR', 'STAFF'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
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
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.patient.count({ where })
    ]);

    res.json({
      patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch patients'
    });
  }
});

// Get patient by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
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
        appointments: {
          include: {
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
          orderBy: { date: 'desc' },
          take: 10
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Patient not found'
      });
    }

    res.json({ patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch patient'
    });
  }
});

// Create new patient
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'STAFF', 'DOCTOR'), async (req, res) => {
  try {
    // Skip validation - accept any data
    const value = req.body;

    const {
      firstName, lastName, email, phone, dateOfBirth, gender,
      address, emergencyContactName, emergencyContactPhone,
      medicalHistory, allergies, bloodGroup,
      // Admission Information
      admitDate, admitTime, notes,
      // Medical Information
      bloodPressure, weight, sugarStatus, sugarLevel, diabetes,
      problem, diagnosis, treatmentPlan, doctorNotes, labReports,
      pastMedicationHistory, currentMedication,
      // Registration Information
      paymentOption, hasInsurance, insuranceNumber, wardNumber,
      doctorId, advanceAmount
    } = value;

    // Skip email validation - allow any data

    // Create user and patient in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: 'temp123', // Temporary password, should be changed
          firstName,
          lastName,
          phone,
          role: 'PATIENT'
        }
      });

      // Create patient profile
      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address,
          emergencyContactName,
          emergencyContactPhone,
          medicalHistory,
          allergies,
          bloodGroup,
          // Admission Information
          admitDate: admitDate ? new Date(admitDate) : null,
          admitTime,
          notes,
          // Medical Information
          bloodPressure,
          weight,
          sugarStatus,
          sugarLevel,
          diabetes,
          problem,
          diagnosis,
          treatmentPlan,
          doctorNotes,
          labReports,
          pastMedicationHistory,
          currentMedication,
          // Registration Information
          paymentOption,
          hasInsurance,
          insuranceNumber,
          wardNumber,
          doctorId,
          advanceAmount
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

      return patient;
    });

    res.status(201).json({
      message: 'Patient created successfully',
      patient: result
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create patient'
    });
  }
});

// Update patient
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'STAFF', 'DOCTOR'), async (req, res) => {
  try {
    const { id } = req.params;
    // No validation - accept any data directly
    const value = req.body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingPatient) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Patient not found'
      });
    }

    // Check authorization
    if (req.user.role === 'PATIENT' && existingPatient.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You can only update your own profile'
      });
    }

    const {
      firstName, lastName, phone, email, dateOfBirth, gender,
      address, emergencyContactName, emergencyContactPhone,
      medicalHistory, allergies, bloodGroup,
      // Admission Information
      admitDate, admitTime, notes,
      // Medical Information
      bloodPressure, weight, sugarStatus, sugarLevel, diabetes,
      problem, diagnosis, treatmentPlan, doctorNotes, labReports,
      pastMedicationHistory, currentMedication,
      // Registration Information
      paymentOption, hasInsurance, insuranceNumber, wardNumber,
      doctorId, advanceAmount
    } = value;

    // Update user and patient in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user data
      if (firstName || lastName || phone || email) {
        await tx.user.update({
          where: { id: existingPatient.userId },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(email && { email })
          }
        });
      }

      // Update patient data
      const patient = await tx.patient.update({
        where: { id },
        data: {
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
          ...(gender && { gender }),
          ...(address && { address }),
          ...(emergencyContactName && { emergencyContactName }),
          ...(emergencyContactPhone && { emergencyContactPhone }),
          ...(medicalHistory && { medicalHistory }),
          ...(allergies && { allergies }),
          ...(bloodGroup && { bloodGroup }),
          // Admission Information
          ...(admitDate && { admitDate: new Date(admitDate) }),
          ...(admitTime && { admitTime }),
          ...(notes && { notes }),
          // Medical Information
          ...(bloodPressure && { bloodPressure }),
          ...(weight && { weight }),
          ...(sugarStatus && { sugarStatus }),
          ...(sugarLevel && { sugarLevel }),
          ...(diabetes && { diabetes }),
          ...(problem && { problem }),
          ...(diagnosis && { diagnosis }),
          ...(treatmentPlan && { treatmentPlan }),
          ...(doctorNotes && { doctorNotes }),
          ...(labReports && { labReports }),
          ...(pastMedicationHistory && { pastMedicationHistory }),
          ...(currentMedication && { currentMedication }),
          // Registration Information
          ...(paymentOption && { paymentOption }),
          ...(hasInsurance && { hasInsurance }),
          ...(insuranceNumber && { insuranceNumber }),
          ...(wardNumber && { wardNumber }),
          ...(doctorId && { doctorId }),
          ...(advanceAmount && { advanceAmount })
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

      return patient;
    });

    res.json({
      message: 'Patient updated successfully',
      patient: result
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update patient'
    });
  }
});

// Delete patient
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Patient not found'
      });
    }

    // Delete patient and associated user
    await prisma.$transaction(async (tx) => {
      await tx.patient.delete({ where: { id } });
      await tx.user.delete({ where: { id: patient.userId } });
    });

    res.json({
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete patient'
    });
  }
});

module.exports = router;
