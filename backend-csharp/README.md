# Food & Mood Tracker - C# Backend

This is the C# 10 ASP.NET Core Web API backend for the Food & Mood Tracker application.

## Project Structure

```
backend-csharp/
├── FoodMoodTracker.Api/          # Main API project
├── FoodMoodTracker.Core/         # Domain models and interfaces
├── FoodMoodTracker.Infrastructure/ # EF Core, repositories, external services
├── FoodMoodTracker.Tests/        # Unit and integration tests
└── FoodMoodTracker.Api.sln       # Solution file
```

## Prerequisites

- .NET 8.0 SDK or later
- MySQL Server 8.0 or later
- Visual Studio 2022, VS Code, or Rider

## Setup

1. **Configure Database Connection**

   Update `appsettings.json` or `appsettings.Development.json` with your MySQL connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=food_mood_tracker;User=root;Password=yourpassword;"
   }
   ```

   Or use the MySQL connection string format:
   ```
   mysql://username:password@localhost:3306/food_mood_tracker
   ```

2. **Configure JWT Secret**

   Update `appsettings.json` with a secure JWT secret:
   ```json
   "Jwt": {
     "Secret": "your-super-secret-jwt-key-here-change-in-production"
   }
   ```

3. **Run Database Migrations**

   The application uses Entity Framework Core. If you're using an existing database, ensure the schema matches. If creating a new database, you can use EF Core migrations:

   ```bash
   cd FoodMoodTracker.Infrastructure
   dotnet ef migrations add InitialCreate --startup-project ../FoodMoodTracker.Api
   dotnet ef database update --startup-project ../FoodMoodTracker.Api
   ```

   Note: Since we're using the same schema as the Prisma backend, you may not need migrations if the database already exists.

4. **Run the Application**

   ```bash
   cd FoodMoodTracker.Api
   dotnet run
   ```

   The API will be available at `https://localhost:5001` or `http://localhost:5000`

## API Endpoints

All endpoints maintain compatibility with the existing Node.js backend.

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

### Food Tracking
- `GET /api/food-entries` - List food entries (with pagination)
- `GET /api/food-entries/{id}` - Get specific entry
- `POST /api/food-entries` - Create entry
- `PUT /api/food-entries/{id}` - Update entry
- `DELETE /api/food-entries/{id}` - Delete entry
- `GET /api/food-entries/summary` - Daily/weekly/monthly summary

### Food Database
- `GET /api/foods/search?q={query}&limit={limit}` - Search food database
- `GET /api/foods/database/{id}` - Get food by ID

### Mood Tracking
- `GET /api/mood-entries` - List mood entries (with pagination)
- `GET /api/mood-entries/{id}` - Get specific entry
- `POST /api/mood-entries` - Create entry
- `PUT /api/mood-entries/{id}` - Update entry
- `DELETE /api/mood-entries/{id}` - Delete entry
- `GET /api/mood-entries/summary` - Mood summary

### Analytics
- `GET /api/analytics/correlations?days={days}` - Food-mood correlations
- `GET /api/analytics/trends?period={period}&months={months}` - Trends analysis
- `GET /api/analytics/insights?days={days}` - Generated insights
- `GET /api/analytics/export?format={json|csv}&startDate={date}&endDate={date}` - Data export

### Health
- `GET /health` - Health check endpoint

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Testing

Run tests with:

```bash
dotnet test
```

## Development

### Building

```bash
dotnet build
```

### Running in Development

```bash
cd FoodMoodTracker.Api
dotnet watch run
```

### Swagger Documentation

When running in Development mode, Swagger UI is available at:
- `https://localhost:5001/swagger` (HTTPS)
- `http://localhost:5000/swagger` (HTTP)

## Configuration

Configuration is managed through:
- `appsettings.json` - Default configuration
- `appsettings.Development.json` - Development overrides
- `appsettings.Production.json` - Production overrides
- Environment variables (override appsettings)

## Technologies Used

- ASP.NET Core 8.0
- Entity Framework Core 8.0
- Pomelo.EntityFrameworkCore.MySql
- JWT Bearer Authentication
- FluentValidation
- BCrypt.Net-Next
- Swagger/OpenAPI

## Notes

- The database schema matches the Prisma schema exactly
- All API endpoints maintain full compatibility with the Node.js backend
- JSON serialization uses camelCase to match JavaScript conventions
- Decimal precision matches the MySQL schema (10,2 for quantities, 3,2 for intensity)

