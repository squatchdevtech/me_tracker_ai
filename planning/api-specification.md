# API Specification

## Base URL
```
Production: https://api.foodmoodtracker.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Error Response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

## Food Tracking Endpoints

### Create Food Entry
```http
POST /food-entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "foodName": "Apple",
  "quantity": 1,
  "unit": "medium",
  "nutritionalData": {
    "calories": 95,
    "protein": 0.5,
    "carbs": 25,
    "fat": 0.3,
    "fiber": 4,
    "sugar": 19,
    "sodium": 2
  },
  "consumedAt": "2024-01-01T12:00:00Z",
  "notes": "Red delicious apple"
}
```

### Get Food Entries
```http
GET /food-entries?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": 1,
        "foodName": "Apple",
        "quantity": 1,
        "unit": "medium",
        "nutritionalData": {
          "calories": 95,
          "protein": 0.5,
          "carbs": 25,
          "fat": 0.3,
          "fiber": 4,
          "sugar": 19,
          "sodium": 2
        },
        "consumedAt": "2024-01-01T12:00:00Z",
        "notes": "Red delicious apple"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Daily Summary
```http
GET /food-entries/summary?date=2024-01-01
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "date": "2024-01-01",
    "totals": {
      "calories": 2000,
      "protein": 150,
      "carbs": 250,
      "fat": 80,
      "fiber": 25,
      "sugar": 100,
      "sodium": 2300
    },
    "entryCount": 5,
    "entries": []
  }
}
```

## Mood Tracking Endpoints

### Create Mood Entry
```http
POST /mood-entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "moodRating": 7,
  "moodType": "happy",
  "intensity": 0.8,
  "durationMinutes": 120,
  "startedAt": "2024-01-01T14:00:00Z",
  "endedAt": "2024-01-01T16:00:00Z",
  "notes": "Feeling great after lunch",
  "triggers": "Good food, sunny weather"
}
```

### Get Mood Entries
```http
GET /mood-entries?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
Authorization: Bearer <token>
```

### Get Mood Summary
```http
GET /mood-entries/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "averageMood": 6.5,
    "moodDistribution": {
      "happy": 15,
      "calm": 10,
      "energetic": 8,
      "tired": 5,
      "stressed": 3
    },
    "trends": {
      "weeklyAverage": [6.2, 6.8, 6.5, 6.9, 6.3, 6.7, 6.4],
      "dailyPatterns": {}
    }
  }
}
```

## Analytics Endpoints

### Get Correlations
```http
GET /analytics/correlations?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "foodMoodCorrelations": [
      {
        "foodCategory": "fruits",
        "moodType": "happy",
        "correlation": 0.65,
        "significance": 0.05,
        "sampleSize": 50
      }
    ],
    "nutrientMoodCorrelations": [
      {
        "nutrient": "protein",
        "moodType": "energetic",
        "correlation": 0.45,
        "significance": 0.01,
        "sampleSize": 100
      }
    ]
  }
}
```

### Get Trends
```http
GET /analytics/trends?period=monthly&months=6
Authorization: Bearer <token>
```

### Export Data
```http
GET /analytics/export?format=csv&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

## Food Database Endpoints

### Search Foods
```http
GET /foods/search?query=apple&limit=10
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "foods": [
      {
        "id": 1,
        "name": "Apple, raw",
        "brand": null,
        "category": "fruits",
        "servingSize": 1,
        "servingUnit": "medium",
        "caloriesPerServing": 95,
        "proteinPerServing": 0.5,
        "carbsPerServing": 25,
        "fatPerServing": 0.3
      }
    ]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Invalid or missing token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user
- Burst allowance: 20 requests per second

## Pagination
All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (default: created_at)
- `order`: Sort order (asc/desc, default: desc)
