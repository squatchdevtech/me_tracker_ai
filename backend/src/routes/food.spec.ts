import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import foodRoutes from './food';

// Mock Prisma
jest.mock('@prisma/client');
const MockedPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;

describe('Food Routes', () => {
  let app: express.Application;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/food-entries', foodRoutes);

    mockPrisma = new MockedPrismaClient() as jest.Mocked<PrismaClient>;
    (foodRoutes as any).prisma = mockPrisma;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GET /api/food-entries', () => {
    it('should get food entries with pagination', async () => {
      const mockEntries = [
        {
          id: 1,
          userId: 1,
          foodName: 'Apple',
          quantity: 1,
          unit: 'medium',
          nutritionalData: { calories: 95, protein: 0.5 },
          consumedAt: new Date('2024-01-15T10:00:00Z'),
          notes: 'Morning snack',
          createdAt: new Date()
        }
      ];

      mockPrisma.foodEntry.findMany.mockResolvedValue(mockEntries);
      mockPrisma.foodEntry.count.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/food-entries')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entries).toHaveLength(1);
      expect(response.body.data.entries[0].foodName).toBe('Apple');
      expect(response.body.data.pagination.total).toBe(1);

      expect(mockPrisma.foodEntry.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { consumedAt: 'desc' },
        skip: 0,
        take: 20
      });
    });

    it('should handle pagination parameters', async () => {
      mockPrisma.foodEntry.findMany.mockResolvedValue([]);
      mockPrisma.foodEntry.count.mockResolvedValue(0);

      await request(app)
        .get('/api/food-entries?page=2&limit=10')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(mockPrisma.foodEntry.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { consumedAt: 'desc' },
        skip: 10, // (page - 1) * limit
        take: 10
      });
    });

    it('should handle database errors', async () => {
      mockPrisma.foodEntry.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/food-entries')
        .set('Authorization', 'Bearer mock-token')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('POST /api/food-entries', () => {
    it('should create new food entry', async () => {
      const foodEntryData = {
        foodName: 'Banana',
        quantity: 1,
        unit: 'medium',
        nutritionalData: { calories: 105, protein: 1.3 },
        consumedAt: '2024-01-15T10:00:00Z',
        notes: 'Healthy snack'
      };

      const createdEntry = {
        id: 1,
        userId: 1,
        ...foodEntryData,
        consumedAt: new Date(foodEntryData.consumedAt),
        createdAt: new Date()
      };

      mockPrisma.foodEntry.create.mockResolvedValue(createdEntry);

      const response = await request(app)
        .post('/api/food-entries')
        .send(foodEntryData)
        .set('Authorization', 'Bearer mock-token')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.foodName).toBe('Banana');
      expect(response.body.data.quantity).toBe(1);

      expect(mockPrisma.foodEntry.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          foodName: 'Banana',
          quantity: 1,
          unit: 'medium',
          nutritionalData: { calories: 105, protein: 1.3 },
          consumedAt: new Date('2024-01-15T10:00:00Z'),
          notes: 'Healthy snack'
        }
      });
    });

    it('should validate required fields', async () => {
      const invalidData = {
        // Missing foodName
        quantity: 1,
        unit: 'medium'
      };

      const response = await request(app)
        .post('/api/food-entries')
        .send(invalidData)
        .set('Authorization', 'Bearer mock-token')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('foodName');
    });

    it('should validate consumedAt date format', async () => {
      const invalidData = {
        foodName: 'Apple',
        consumedAt: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/food-entries')
        .send(invalidData)
        .set('Authorization', 'Bearer mock-token')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('consumedAt');
    });
  });

  describe('GET /api/food-entries/:id', () => {
    it('should get specific food entry', async () => {
      const mockEntry = {
        id: 1,
        userId: 1,
        foodName: 'Apple',
        quantity: 1,
        unit: 'medium',
        nutritionalData: { calories: 95, protein: 0.5 },
        consumedAt: new Date('2024-01-15T10:00:00Z'),
        notes: 'Morning snack',
        createdAt: new Date()
      };

      mockPrisma.foodEntry.findFirst.mockResolvedValue(mockEntry);

      const response = await request(app)
        .get('/api/food-entries/1')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.entry.foodName).toBe('Apple');

      expect(mockPrisma.foodEntry.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 }
      });
    });

    it('should return 404 for non-existent entry', async () => {
      mockPrisma.foodEntry.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/food-entries/999')
        .set('Authorization', 'Bearer mock-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Food entry not found');
    });
  });

  describe('PUT /api/food-entries/:id', () => {
    it('should update food entry', async () => {
      const updateData = {
        foodName: 'Apple (Updated)',
        quantity: 2,
        unit: 'medium',
        notes: 'Updated notes'
      };

      const updatedEntry = {
        id: 1,
        userId: 1,
        ...updateData,
        nutritionalData: { calories: 95, protein: 0.5 },
        consumedAt: new Date('2024-01-15T10:00:00Z'),
        createdAt: new Date()
      };

      mockPrisma.foodEntry.findFirst.mockResolvedValue({ id: 1, userId: 1 } as any);
      mockPrisma.foodEntry.update.mockResolvedValue(updatedEntry);

      const response = await request(app)
        .put('/api/food-entries/1')
        .send(updateData)
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.foodName).toBe('Apple (Updated)');

      expect(mockPrisma.foodEntry.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData
      });
    });

    it('should return 404 for non-existent entry', async () => {
      mockPrisma.foodEntry.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/food-entries/999')
        .send({ foodName: 'Updated' })
        .set('Authorization', 'Bearer mock-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Food entry not found');
    });
  });

  describe('DELETE /api/food-entries/:id', () => {
    it('should delete food entry', async () => {
      mockPrisma.foodEntry.findFirst.mockResolvedValue({ id: 1, userId: 1 } as any);
      mockPrisma.foodEntry.delete.mockResolvedValue({ id: 1 } as any);

      const response = await request(app)
        .delete('/api/food-entries/1')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      expect(mockPrisma.foodEntry.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 for non-existent entry', async () => {
      mockPrisma.foodEntry.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/food-entries/999')
        .set('Authorization', 'Bearer mock-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Food entry not found');
    });
  });

  describe('GET /api/food-entries/summary', () => {
    it('should get food summary', async () => {
      const mockSummary = {
        totalEntries: 5,
        totalCalories: 1200,
        averageCaloriesPerDay: 240,
        topFoods: [
          { name: 'Apple', count: 3 },
          { name: 'Banana', count: 2 }
        ]
      };

      // Mock the aggregation queries
      mockPrisma.foodEntry.count.mockResolvedValue(5);
      mockPrisma.foodEntry.findMany.mockResolvedValue([
        { foodName: 'Apple', nutritionalData: { calories: 95 } },
        { foodName: 'Apple', nutritionalData: { calories: 95 } },
        { foodName: 'Apple', nutritionalData: { calories: 95 } },
        { foodName: 'Banana', nutritionalData: { calories: 105 } },
        { foodName: 'Banana', nutritionalData: { calories: 105 } }
      ] as any);

      const response = await request(app)
        .get('/api/food-entries/summary')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalEntries).toBe(5);
      expect(response.body.data.totalCalories).toBe(1200);
    });
  });
});
























