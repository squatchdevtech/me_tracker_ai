# Testing Guide

This document provides comprehensive information about testing the Food & Mood Tracker application.

## Overview

The application uses Jest as the primary testing framework for both frontend and backend components. Tests are organized to cover:

- **Unit Tests**: Individual components, services, and functions
- **Integration Tests**: API endpoints and service interactions
- **End-to-End Tests**: Complete user workflows (planned)

## Test Structure

### Frontend Tests
- **Location**: `frontend/src/**/*.spec.ts`
- **Framework**: Jest with Angular testing utilities
- **Coverage**: Components, services, pipes, and directives

### Backend Tests
- **Location**: `backend/src/**/*.spec.ts`
- **Framework**: Jest with Supertest for API testing
- **Coverage**: Routes, middleware, and business logic

## Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Run All Tests

```bash
# From project root
npm run test:all  # (if configured)
```

## Test Categories

### 1. Service Tests

#### AuthService Tests
- ✅ User registration
- ✅ User login
- ✅ Token management
- ✅ Profile operations
- ✅ Error handling

#### FoodService Tests
- ✅ CRUD operations
- ✅ Pagination
- ✅ Data validation
- ✅ Error handling

#### MoodService Tests
- ✅ CRUD operations
- ✅ Data validation
- ✅ Error handling

#### AnalyticsService Tests
- ✅ Correlation analysis
- ✅ Trend calculations
- ✅ Data export
- ✅ Error handling

### 2. Component Tests

#### Authentication Components
- ✅ LoginComponent
  - Form validation
  - User authentication
  - Error handling
  - Navigation

- ✅ RegisterComponent
  - Form validation
  - User registration
  - Password confirmation
  - Error handling

- ✅ ProfileComponent
  - Profile display
  - Profile updates
  - Form validation

#### Mood Tracking Components
- ✅ MoodListComponent
  - Data display
  - CRUD operations
  - Date formatting
  - Error handling

- ✅ MoodEntryFormComponent
  - Form validation
  - Data submission
  - Edit mode
  - Error handling

- ✅ MoodCalendarComponent
  - Calendar display
  - Date selection
  - Mood visualization
  - Data interaction

#### Food Tracking Components
- ✅ FoodListComponent
  - Data display
  - CRUD operations
  - Error handling

- ✅ FoodEntryFormComponent
  - Form validation
  - Food search integration
  - Data submission
  - Error handling

- ✅ FoodSearchComponent
  - Search functionality
  - Food selection
  - Mock data handling
  - User interaction

#### Analytics Components
- ✅ CorrelationsComponent
  - Data display
  - Statistical analysis
  - Filtering
  - Error handling

- ✅ TrendsComponent
  - Trend visualization
  - Data analysis
  - Period selection
  - Error handling

- ✅ InsightsComponent
  - Insight display
  - Filtering
  - User interaction
  - Error handling

### 3. Backend API Tests

#### Authentication Routes
- ✅ POST /api/auth/register
  - User creation
  - Validation
  - Error handling

- ✅ POST /api/auth/login
  - Authentication
  - Token generation
  - Error handling

- ✅ GET /api/auth/profile
  - Profile retrieval
  - Authorization

- ✅ PUT /api/auth/profile
  - Profile updates
  - Validation

#### Food Routes
- ✅ GET /api/food-entries
  - Data retrieval
  - Pagination
  - Filtering

- ✅ POST /api/food-entries
  - Data creation
  - Validation
  - Error handling

- ✅ GET /api/food-entries/:id
  - Single entry retrieval
  - Authorization

- ✅ PUT /api/food-entries/:id
  - Data updates
  - Validation

- ✅ DELETE /api/food-entries/:id
  - Data deletion
  - Authorization

- ✅ GET /api/food-entries/summary
  - Summary calculations
  - Data aggregation

## Test Configuration

### Frontend Configuration
- **Jest Config**: `frontend/jest.config.js`
- **Test Setup**: `frontend/src/test-setup.ts`
- **Coverage**: HTML and LCOV reports

### Backend Configuration
- **Jest Config**: `backend/jest.config.js`
- **Test Setup**: `backend/src/__tests__/setup.ts`
- **Coverage**: HTML and LCOV reports

## Mocking Strategy

### Frontend Mocks
- **Services**: Mocked using Jasmine spies
- **HTTP Requests**: Mocked using Angular's HttpClientTestingModule
- **Router**: Mocked using Jasmine spies
- **Local Storage**: Mocked in test setup

### Backend Mocks
- **Prisma Client**: Mocked using Jest mocks
- **External Dependencies**: Mocked (bcrypt, jsonwebtoken, etc.)
- **Express Middleware**: Mocked for testing

## Coverage Goals

### Frontend Coverage
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Backend Coverage
- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 85%
- **Lines**: > 85%

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear, descriptive test names
3. **Single Responsibility**: Test one thing per test
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include error conditions and boundary values

### Test Organization
1. **Group Related Tests**: Use describe blocks
2. **Setup and Teardown**: Use beforeEach/afterEach appropriately
3. **Mock Cleanup**: Clear mocks between tests
4. **Test Data**: Use consistent test data

### Maintenance
1. **Keep Tests Updated**: Update tests when code changes
2. **Remove Dead Tests**: Delete tests for removed features
3. **Refactor Tests**: Improve test quality over time
4. **Monitor Coverage**: Track coverage trends

## Debugging Tests

### Frontend Debugging
```bash
# Run specific test file
npm test -- --testPathPattern=login.component.spec.ts

# Run tests with verbose output
npm test -- --verbose

# Debug tests in VS Code
# Use Jest extension with breakpoints
```

### Backend Debugging
```bash
# Run specific test file
npm test -- --testPathPattern=auth.spec.ts

# Run tests with verbose output
npm test -- --verbose

# Debug with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Continuous Integration

### GitHub Actions (Planned)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v1
```

## Test Data

### Mock Data
- **Users**: Test user accounts with various roles
- **Food Entries**: Sample food consumption data
- **Mood Entries**: Sample mood tracking data
- **Analytics**: Mock correlation and trend data

### Test Database
- **Environment**: Separate test database
- **Migrations**: Automated schema setup
- **Cleanup**: Data cleanup between tests

## Performance Testing

### Frontend Performance
- **Bundle Size**: Monitor bundle size impact
- **Render Performance**: Test component render times
- **Memory Leaks**: Check for memory leaks in tests

### Backend Performance
- **API Response Times**: Test endpoint performance
- **Database Queries**: Monitor query performance
- **Memory Usage**: Check for memory leaks

## Security Testing

### Authentication Tests
- ✅ JWT token validation
- ✅ Password hashing
- ✅ Input validation
- ✅ Authorization checks

### API Security Tests
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input sanitization
- ✅ SQL injection prevention

## Future Enhancements

### Planned Test Improvements
1. **E2E Tests**: Cypress or Playwright integration
2. **Visual Regression Tests**: Screenshot comparisons
3. **Load Testing**: API performance under load
4. **Security Testing**: Automated security scans
5. **Accessibility Testing**: Automated a11y checks

### Test Infrastructure
1. **Test Database**: Dedicated test database setup
2. **Test Data Factory**: Automated test data generation
3. **Test Reports**: Enhanced reporting and dashboards
4. **Test Metrics**: Performance and quality metrics

## Troubleshooting

### Common Issues
1. **Test Timeouts**: Increase timeout values
2. **Mock Issues**: Check mock configurations
3. **Async Issues**: Use proper async/await patterns
4. **Coverage Issues**: Check file patterns and exclusions

### Getting Help
1. **Documentation**: Check Jest and Angular testing docs
2. **Community**: Stack Overflow, GitHub issues
3. **Team**: Internal knowledge sharing
4. **Debugging**: Use browser dev tools and Node.js inspector

---

## Quick Reference

### Run Tests
```bash
# Frontend
cd frontend && npm test

# Backend  
cd backend && npm test

# Both
npm run test:all
```

### Coverage Reports
```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Debug Tests
```bash
# Frontend
npm test -- --testNamePattern="should login user"

# Backend
npm test -- --testNamePattern="should register user"
```

This testing setup ensures the Food & Mood Tracker application is reliable, maintainable, and ready for production deployment.
























