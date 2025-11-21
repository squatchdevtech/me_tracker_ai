import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authRoutes from './auth';

// Mock Prisma
jest.mock('@prisma/client');
const MockedPrismaClient = PrismaClient as jest.MockedClass<typeof PrismaClient>;

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Routes', () => {
  let app: express.Application;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    mockPrisma = new MockedPrismaClient() as jest.Mocked<PrismaClient>;
    (authRoutes as any).prisma = mockPrisma;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
      expect(response.body.data.password).toBeUndefined(); // Password should not be returned

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: null
        }
      });
    });

    it('should return error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const existingUser = {
        id: 1,
        email: 'existing@example.com',
        passwordHash: 'hashedPassword',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already exists');
    });

    it('should return error for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email format');
    });

    it('should return error for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Password must be at least 8 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const token = 'mock-jwt-token';

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedJwt.sign.mockReturnValue(token);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe(token);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.passwordHash).toBeUndefined();

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 1, email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile successfully', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the authenticateToken middleware
      const mockReq = {
        user: { id: 1, email: 'test@example.com' }
      };

      mockPrisma.user.findUnique.mockResolvedValue(user);

      // We need to mock the middleware or create a test version
      // For now, we'll test the route handler directly
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      // This test would need proper middleware mocking
      // For now, we're just testing the route structure
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'updated@example.com'
      };

      const updatedUser = {
        id: 1,
        email: 'updated@example.com',
        passwordHash: 'hashedPassword123',
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        dateOfBirth: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/auth/profile')
        .send(updateData)
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      // This test would need proper middleware mocking
      // For now, we're just testing the route structure
    });
  });
});
























