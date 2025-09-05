import express from 'express';
import Joi from 'joi';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const moodEntrySchema = Joi.object({
  moodRating: Joi.number().integer().min(1).max(10).required(),
  moodType: Joi.string().valid(
    'happy', 'sad', 'anxious', 'energetic', 'tired', 
    'stressed', 'calm', 'irritable', 'focused', 'confused'
  ).required(),
  intensity: Joi.number().min(0).max(1).optional(),
  durationMinutes: Joi.number().integer().positive().optional(),
  startedAt: Joi.date().required(),
  endedAt: Joi.date().optional(),
  notes: Joi.string().optional(),
  triggers: Joi.string().optional()
});

// Get all mood entries for user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId: req.user!.id },
        orderBy: { startedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.moodEntry.count({
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
    console.error('Get mood entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get specific mood entry
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid entry ID'
      });
    }

    const entry = await prisma.moodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create new mood entry
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { error, value } = moodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const entry = await prisma.moodEntry.create({
      data: {
        ...value,
        userId: req.user!.id,
        startedAt: new Date(value.startedAt),
        endedAt: value.endedAt ? new Date(value.endedAt) : null
      }
    });

    res.status(201).json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update mood entry
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const entryId = parseInt(req.params.id);
    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid entry ID'
      });
    }

    const { error, value } = moodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    const entry = await prisma.moodEntry.update({
      where: { id: entryId },
      data: {
        ...value,
        startedAt: new Date(value.startedAt),
        endedAt: value.endedAt ? new Date(value.endedAt) : null
      }
    });

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete mood entry
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
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id: entryId,
        userId: req.user!.id
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Mood entry not found'
      });
    }

    await prisma.moodEntry.delete({
      where: { id: entryId }
    });

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get mood summary and patterns
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

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: req.user!.id,
        startedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { startedAt: 'asc' }
    });

    // Calculate mood statistics
    const moodStats = entries.reduce((acc, entry) => {
      acc.totalRating += entry.moodRating;
      acc.entryCount++;
      
      if (!acc.moodTypeCount[entry.moodType]) {
        acc.moodTypeCount[entry.moodType] = 0;
      }
      acc.moodTypeCount[entry.moodType]++;
      
      if (entry.intensity) {
        acc.totalIntensity += entry.intensity;
        acc.intensityCount++;
      }
      
      return acc;
    }, {
      totalRating: 0,
      entryCount: 0,
      moodTypeCount: {} as Record<string, number>,
      totalIntensity: 0,
      intensityCount: 0
    });

    const averageRating = moodStats.entryCount > 0 ? moodStats.totalRating / moodStats.entryCount : 0;
    const averageIntensity = moodStats.intensityCount > 0 ? moodStats.totalIntensity / moodStats.intensityCount : 0;

    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        summary: {
          averageRating: Math.round(averageRating * 100) / 100,
          averageIntensity: Math.round(averageIntensity * 100) / 100,
          entryCount: moodStats.entryCount,
          moodTypeDistribution: moodStats.moodTypeCount
        },
        entries
      }
    });
  } catch (error) {
    console.error('Get mood summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
