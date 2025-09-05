import express from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get food-mood correlations
router.get('/correlations', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get food and mood entries for the specified period
    const [foodEntries, moodEntries] = await Promise.all([
      prisma.foodEntry.findMany({
        where: {
          userId: req.user!.id,
          consumedAt: { gte: startDate }
        },
        orderBy: { consumedAt: 'asc' }
      }),
      prisma.moodEntry.findMany({
        where: {
          userId: req.user!.id,
          startedAt: { gte: startDate }
        },
        orderBy: { startedAt: 'asc' }
      })
    ]);

    // Simple correlation analysis
    const correlations = analyzeCorrelations(foodEntries, moodEntries);

    res.json({
      success: true,
      data: {
        period: { days, startDate },
        correlations,
        totalFoodEntries: foodEntries.length,
        totalMoodEntries: moodEntries.length
      }
    });
  } catch (error) {
    console.error('Get correlations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get trends analysis
router.get('/trends', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const period = req.query.period as string || 'monthly';
    const months = parseInt(req.query.months as string) || 6;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get mood trends
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: req.user!.id,
        startedAt: { gte: startDate, lte: endDate }
      },
      orderBy: { startedAt: 'asc' }
    });

    // Get food trends
    const foodEntries = await prisma.foodEntry.findMany({
      where: {
        userId: req.user!.id,
        consumedAt: { gte: startDate, lte: endDate }
      },
      orderBy: { consumedAt: 'asc' }
    });

    const trends = analyzeTrends(moodEntries, foodEntries, period);

    res.json({
      success: true,
      data: {
        period: { months, startDate, endDate },
        trends
      }
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get insights
router.get('/insights', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get recent data
    const [foodEntries, moodEntries] = await Promise.all([
      prisma.foodEntry.findMany({
        where: {
          userId: req.user!.id,
          consumedAt: { gte: startDate }
        }
      }),
      prisma.moodEntry.findMany({
        where: {
          userId: req.user!.id,
          startedAt: { gte: startDate }
        }
      })
    ]);

    const insights = generateInsights(foodEntries, moodEntries);

    res.json({
      success: true,
      data: {
        period: { days, startDate },
        insights
      }
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Export data
router.get('/export', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const format = req.query.format as string || 'json';
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : null;

    const whereClause: any = { userId: req.user!.id };
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const [foodEntries, moodEntries] = await Promise.all([
      prisma.foodEntry.findMany({
        where: whereClause,
        orderBy: { consumedAt: 'asc' }
      }),
      prisma.moodEntry.findMany({
        where: whereClause,
        orderBy: { startedAt: 'asc' }
      })
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: { startDate, endDate },
      foodEntries,
      moodEntries
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="food-mood-data.csv"');
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="food-mood-data.json"');
      res.json(exportData);
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Helper functions
function analyzeCorrelations(foodEntries: any[], moodEntries: any[]) {
  // Simple correlation analysis
  const correlations: any[] = [];
  
  // Group entries by day
  const dailyData: Record<string, { food: any[], mood: any[] }> = {};
  
  foodEntries.forEach(entry => {
    const date = entry.consumedAt.toISOString().split('T')[0];
    if (!dailyData[date]) dailyData[date] = { food: [], mood: [] };
    dailyData[date].food.push(entry);
  });
  
  moodEntries.forEach(entry => {
    const date = entry.startedAt.toISOString().split('T')[0];
    if (!dailyData[date]) dailyData[date] = { food: [], mood: [] };
    dailyData[date].mood.push(entry);
  });
  
  // Calculate basic correlations
  const foodTypes: Record<string, number[]> = {};
  const moodRatings: number[] = [];
  
  Object.values(dailyData).forEach(day => {
    if (day.mood.length > 0) {
      const avgMood = day.mood.reduce((sum, m) => sum + m.moodRating, 0) / day.mood.length;
      moodRatings.push(avgMood);
      
      day.food.forEach(food => {
        if (!foodTypes[food.foodName]) foodTypes[food.foodName] = [];
        foodTypes[food.foodName].push(avgMood);
      });
    }
  });
  
  // Calculate correlation for each food type
  Object.entries(foodTypes).forEach(([foodName, ratings]) => {
    if (ratings.length >= 3) { // Minimum data points
      const correlation = calculateCorrelation(ratings, moodRatings.slice(0, ratings.length));
      correlations.push({
        foodName,
        correlation: Math.round(correlation * 100) / 100,
        dataPoints: ratings.length
      });
    }
  });
  
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

function analyzeTrends(moodEntries: any[], foodEntries: any[], period: string) {
  const trends = {
    mood: {
      averageRating: 0,
      trend: 'stable',
      moodTypeDistribution: {} as Record<string, number>
    },
    food: {
      totalEntries: foodEntries.length,
      averageEntriesPerDay: 0,
      topFoods: [] as any[]
    }
  };
  
  // Mood trends
  if (moodEntries.length > 0) {
    const totalRating = moodEntries.reduce((sum, entry) => sum + entry.moodRating, 0);
    trends.mood.averageRating = Math.round((totalRating / moodEntries.length) * 100) / 100;
    
    // Mood type distribution
    moodEntries.forEach(entry => {
      trends.mood.moodTypeDistribution[entry.moodType] = 
        (trends.mood.moodTypeDistribution[entry.moodType] || 0) + 1;
    });
  }
  
  // Food trends
  const foodCounts: Record<string, number> = {};
  foodEntries.forEach(entry => {
    foodCounts[entry.foodName] = (foodCounts[entry.foodName] || 0) + 1;
  });
  
  trends.food.topFoods = Object.entries(foodCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return trends;
}

function generateInsights(foodEntries: any[], moodEntries: any[]) {
  const insights: string[] = [];
  
  if (moodEntries.length === 0) {
    insights.push("Start tracking your mood to get personalized insights!");
    return insights;
  }
  
  if (foodEntries.length === 0) {
    insights.push("Start tracking your food intake to discover correlations with your mood!");
    return insights;
  }
  
  // Basic insights
  const avgMood = moodEntries.reduce((sum, m) => sum + m.moodRating, 0) / moodEntries.length;
  
  if (avgMood >= 7) {
    insights.push("Your mood has been consistently positive! Keep up the great work.");
  } else if (avgMood <= 4) {
    insights.push("Consider tracking what foods you eat when you feel better to identify positive patterns.");
  }
  
  const uniqueFoods = new Set(foodEntries.map(f => f.foodName)).size;
  if (uniqueFoods < 5) {
    insights.push("Try diversifying your diet - variety can positively impact your mood and health.");
  }
  
  return insights;
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;
  
  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function convertToCSV(data: any): string {
  const headers = ['Date', 'Type', 'Name', 'Value', 'Notes'];
  const rows = [headers.join(',')];
  
  data.foodEntries.forEach((entry: any) => {
    rows.push([
      entry.consumedAt.toISOString().split('T')[0],
      'Food',
      entry.foodName,
      entry.quantity || '',
      entry.notes || ''
    ].map(field => `"${field}"`).join(','));
  });
  
  data.moodEntries.forEach((entry: any) => {
    rows.push([
      entry.startedAt.toISOString().split('T')[0],
      'Mood',
      entry.moodType,
      entry.moodRating,
      entry.notes || ''
    ].map(field => `"${field}"`).join(','));
  });
  
  return rows.join('\n');
}

export default router;
