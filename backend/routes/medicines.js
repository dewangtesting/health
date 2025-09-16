const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createMedicineSchema = Joi.object({
  name: Joi.string().required(),
  genericName: Joi.string().optional(),
  category: Joi.string().required(),
  manufacturer: Joi.string().optional(),
  strength: Joi.string().required(),
  dosageForm: Joi.string().optional(),
  price: Joi.number().min(0).required(),
  stockQuantity: Joi.number().integer().min(0).required(),
  expiryDate: Joi.date().required(),
  batchNumber: Joi.string().optional(),
  description: Joi.string().optional(),
  sideEffects: Joi.string().optional(),
  minStockLevel: Joi.number().integer().min(0).default(10),
  requiresPrescription: Joi.boolean().default(false),
  isControlledSubstance: Joi.boolean().default(false)
});

const updateMedicineSchema = Joi.object({
  name: Joi.string().optional(),
  genericName: Joi.string().optional(),
  category: Joi.string().optional(),
  manufacturer: Joi.string().optional(),
  strength: Joi.string().optional(),
  dosageForm: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  stockQuantity: Joi.number().integer().min(0).optional(),
  expiryDate: Joi.date().optional(),
  batchNumber: Joi.string().optional(),
  description: Joi.string().optional(),
  sideEffects: Joi.string().optional(),
  minStockLevel: Joi.number().integer().min(0).optional(),
  requiresPrescription: Joi.boolean().optional(),
  isControlledSubstance: Joi.boolean().optional()
});

// Get all medicines
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', lowStock = false } = req.query;
    const skip = (page - 1) * limit;

    let where = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Category filter
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Low stock filter
    if (lowStock === 'true') {
      where.stock = { lte: 10 }; // Use a default value instead of raw query
    }

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.medicine.count({ where })
    ]);

    res.json({
      medicines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medicines'
    });
  }
});

// Get medicine by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await prisma.medicine.findUnique({
      where: { id }
    });

    if (!medicine) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Medicine not found'
      });
    }

    res.json({ medicine });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medicine'
    });
  }
});

// Create new medicine
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const { error, value } = createMedicineSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    // Map dosageForm to valid MedicineForm enum
    const mapDosageForm = (form) => {
      if (!form) return 'TABLET'
      const formUpper = form.toUpperCase()
      const validForms = ['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'DROPS', 'INHALER']
      return validForms.includes(formUpper) ? formUpper : 'TABLET'
    }

    // Map frontend fields to database fields
    const medicineData = {
      name: value.name,
      genericName: value.genericName,
      category: value.category,
      manufacturer: value.manufacturer,
      dosage: value.strength, // Map strength to dosage
      form: mapDosageForm(value.dosageForm), // Map dosageForm to valid enum
      price: value.price,
      stock: value.stockQuantity, // Map stockQuantity to stock
      expiryDate: new Date(value.expiryDate),
      batchNumber: value.batchNumber,
      description: value.description,
      sideEffects: value.sideEffects,
      minStockLevel: value.minStockLevel,
      requiresPrescription: value.requiresPrescription,
      isControlled: value.isControlledSubstance // Map isControlledSubstance to isControlled
    }

    const medicine = await prisma.medicine.create({
      data: medicineData
    });

    res.status(201).json({
      message: 'Medicine created successfully',
      medicine
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create medicine'
    });
  }
});

// Update medicine
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateMedicineSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.details[0].message
      });
    }

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id }
    });

    if (!existingMedicine) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Medicine not found'
      });
    }

    // Map dosageForm to valid MedicineForm enum
    const mapDosageForm = (form) => {
      if (!form) return 'TABLET'
      const formUpper = form.toUpperCase()
      const validForms = ['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'DROPS', 'INHALER']
      return validForms.includes(formUpper) ? formUpper : 'TABLET'
    }

    // Map frontend fields to database fields
    const updateData = {};
    
    if (value.name) updateData.name = value.name;
    if (value.genericName !== undefined) updateData.genericName = value.genericName;
    if (value.category) updateData.category = value.category;
    if (value.manufacturer !== undefined) updateData.manufacturer = value.manufacturer;
    if (value.strength) updateData.dosage = value.strength; // Map strength to dosage
    if (value.dosageForm !== undefined) updateData.form = mapDosageForm(value.dosageForm); // Map dosageForm to valid enum
    if (value.price !== undefined) updateData.price = value.price;
    if (value.stockQuantity !== undefined) updateData.stock = value.stockQuantity; // Map stockQuantity to stock
    if (value.expiryDate) updateData.expiryDate = new Date(value.expiryDate);
    if (value.batchNumber !== undefined) updateData.batchNumber = value.batchNumber;
    if (value.description !== undefined) updateData.description = value.description;
    if (value.sideEffects !== undefined) updateData.sideEffects = value.sideEffects;
    if (value.minStockLevel !== undefined) updateData.minStockLevel = value.minStockLevel;
    if (value.requiresPrescription !== undefined) updateData.requiresPrescription = value.requiresPrescription;
    if (value.isControlledSubstance !== undefined) updateData.isControlled = value.isControlledSubstance; // Map isControlledSubstance to isControlled

    const medicine = await prisma.medicine.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Medicine updated successfully',
      medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update medicine'
    });
  }
});

// Delete medicine
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await prisma.medicine.findUnique({
      where: { id }
    });

    if (!medicine) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Medicine not found'
      });
    }

    await prisma.medicine.delete({
      where: { id }
    });

    res.json({
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete medicine'
    });
  }
});

// Get low stock medicines
router.get('/alerts/low-stock', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const lowStockMedicines = await prisma.medicine.findMany({
      where: {
        stock: {
          lte: 10 // Use a default value instead of raw query
        }
      },
      orderBy: { stock: 'asc' }
    });

    res.json({
      lowStockMedicines,
      count: lowStockMedicines.length
    });
  } catch (error) {
    console.error('Get low stock medicines error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch low stock medicines'
    });
  }
});

// Get expired medicines
router.get('/alerts/expired', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const expiredMedicines = await prisma.medicine.findMany({
      where: {
        expiryDate: {
          lt: new Date()
        }
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json({
      expiredMedicines,
      count: expiredMedicines.length
    });
  } catch (error) {
    console.error('Get expired medicines error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expired medicines'
    });
  }
});

// Get medicines expiring soon (within 30 days)
router.get('/alerts/expiring-soon', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringSoonMedicines = await prisma.medicine.findMany({
      where: {
        expiryDate: {
          gte: new Date(),
          lte: thirtyDaysFromNow
        }
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json({
      expiringSoonMedicines,
      count: expiringSoonMedicines.length
    });
  } catch (error) {
    console.error('Get expiring soon medicines error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medicines expiring soon'
    });
  }
});

// Update medicine stock
router.patch('/:id/stock', authenticateToken, authorizeRoles('ADMIN', 'STAFF'), async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, operation = 'set' } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Stock must be a non-negative number'
      });
    }

    const medicine = await prisma.medicine.findUnique({
      where: { id }
    });

    if (!medicine) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Medicine not found'
      });
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = medicine.stock + stock;
        break;
      case 'subtract':
        newStock = Math.max(0, medicine.stock - stock);
        break;
      case 'set':
      default:
        newStock = stock;
        break;
    }

    const updatedMedicine = await prisma.medicine.update({
      where: { id },
      data: { stock: newStock }
    });

    res.json({
      message: 'Medicine stock updated successfully',
      medicine: updatedMedicine,
      previousStock: medicine.stock,
      newStock
    });
  } catch (error) {
    console.error('Update medicine stock error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update medicine stock'
    });
  }
});

module.exports = router;
