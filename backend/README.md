# Food & Mood Tracker - Backend API

A Node.js/Express backend API for tracking food intake and mood patterns with correlation analysis.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi
- **Testing**: Jest

## Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Update the `.env` file with your database credentials and JWT secrets:

```env
DATABASE_URL="mysql://username:password@localhost:3306/food_mood_tracker"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:4200"
```

### 3. Database Setup

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Seed the database with initial food data:

```bash
npm run prisma:seed
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Food Tracking
- `GET /api/food-entries` - Get user's food entries
- `POST /api/food-entries` - Create new food entry
- `GET /api/food-entries/:id` - Get specific food entry
- `PUT /api/food-entries/:id` - Update food entry
- `DELETE /api/food-entries/:id` - Delete food entry
- `GET /api/food-entries/summary` - Get food summary

### Mood Tracking
- `GET /api/mood-entries` - Get user's mood entries
- `POST /api/mood-entries` - Create new mood entry
- `GET /api/mood-entries/:id` - Get specific mood entry
- `PUT /api/mood-entries/:id` - Update mood entry
- `DELETE /api/mood-entries/:id` - Delete mood entry
- `GET /api/mood-entries/summary` - Get mood summary

### Analytics
- `GET /api/analytics/correlations` - Food-mood correlations
- `GET /api/analytics/trends` - Long-term trends
- `GET /api/analytics/insights` - AI-generated insights
- `GET /api/analytics/export` - Export data

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with initial data

## Database Schema

The application uses the following main entities:

- **Users**: User accounts and profiles
- **FoodEntries**: Individual food consumption records
- **MoodEntries**: Mood tracking records
- **FoodDatabase**: Nutritional information for foods

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet for security headers

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Health Check

The API includes a health check endpoint:

```
GET /health
```

Returns server status and uptime information.

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use meaningful commit messages
4. Update documentation as needed
