import express from 'express';
import Joi from 'joi';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const foodEntrySchema = Joi.object({
  foodName: Joi.string().required(),
  quantity: Joi.number().positive().optional(),
  unit: Joi.string().optional(),
  nutritionalData: Joi.object().optional(),
  consumedAt: Joi.date().required(),
  notes: Joi.string().optional()
});

// Get all food entries for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.foodEntry.findMany({
        where: { userId: req.user!.id },
        orderBy: { consumedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.foodEntry.count({
        where: { userId: req.user!.id }
      })
    ]);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get specific food entry
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid entry ID'
      });
    }

    const entry = await prisma.foodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Food entry not found'
      });
    }

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Get food entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new food entry
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { error, value } = foodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const entry = await prisma.foodEntry.create({
      data: {
        ...value,
        userId: req.user!.id,
        consumedAt: new Date(value.consumedAt)
      }
    });

    res.status(201).json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Create food entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update food entry
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid entry ID'
      });
    }

    const { error, value } = foodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Food entry not found'
      });
    }

    const entry = await prisma.foodEntry.update({
      where: { id: entryId },
      data: {
        ...value,
        consumedAt: new Date(value.consumedAt)
      }
    });

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Update food entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete food entry
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid entry ID'
      });
    }

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.foodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Food entry not found'
      });
    }

    await prisma.foodEntry.delete({
      where: { id: entryId }
    });

    res.json({
      success: true,
      message: 'Food entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get food summary (daily/weekly/monthly)
router.get('/summary', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const period = req.query.period as string || 'daily';
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        startDate = new Date(date);
        startDate.setDate(date.getDate() - date.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid period. Use daily, weekly, or monthly'
        });
    }

    const entries = await prisma.foodEntry.findMany({
      where: {
        userId: req.user!.id,
        consumedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { consumedAt: 'asc' }
    });

    // Calculate nutritional summary
    const summary = entries.reduce((acc, entry) => {
      const nutritionalData = entry.nutritionalData as any;
      if (nutritionalData) {
        acc.totalCalories += nutritionalData.calories || 0;
        acc.totalProtein += nutritionalData.protein || 0;
        acc.totalCarbs += nutritionalData.carbs || 0;
        acc.totalFat += nutritionalData.fat || 0;
        acc.totalFiber += nutritionalData.fiber || 0;
        acc.totalSugar += nutritionalData.sugar || 0;
        acc.totalSodium += nutritionalData.sodium || 0;
      }
      return acc;
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalSugar: 0,
      totalSodium: 0,
      entryCount: entries.length
    });

    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        summary,
        entries
      }
    });
  } catch (error) {
    console.error('Get food summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
