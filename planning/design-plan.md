# Food & Mood Tracker App - Design Plan

## Project Overview

A comprehensive application to track daily food intake and mood patterns, enabling users to identify correlations between their diet and emotional well-being.

## System Architecture

### Technology Stack

#### Frontend
- **Framework**: Angular 17+ (latest stable)
- **UI Library**: Angular Material or PrimeNG
- **State Management**: NgRx (for complex state) or Angular Services
- **Charts/Visualization**: Chart.js or D3.js
- **Styling**: SCSS with Angular Material theming
- **Build Tool**: Angular CLI

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM**: Prisma or TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: Joi or Zod
- **Language**: TypeScript for type safety

#### Database
- **Database**: MySQL 8.0+
- **Pros**: Mature, ACID compliance, excellent for relational data, strong community support
- **ORM Integration**: Works seamlessly with Prisma/TypeORM
- **Scaling**: Can handle significant load with proper indexing and optimization

## Database Design

### Core Entities

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Food Entries Table
```sql
CREATE TABLE food_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(50), -- grams, cups, pieces, etc.
    nutritional_data JSON, -- Flexible storage for nutritional information
    consumed_at TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Mood Entries Table
```sql
CREATE TABLE mood_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mood_rating INT NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
    mood_type ENUM('happy', 'sad', 'anxious', 'energetic', 'tired', 'stressed', 'calm', 'irritable', 'focused', 'confused') NOT NULL,
    intensity DECIMAL(3,2) CHECK (intensity >= 0.0 AND intensity <= 1.0),
    duration_minutes INT,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    notes TEXT,
    triggers TEXT, -- what might have caused this mood
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Food Database Table (for nutritional information)
```sql
CREATE TABLE food_database (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    serving_size DECIMAL(10,2),
    serving_unit VARCHAR(50),
    calories_per_serving DECIMAL(10,2),
    protein_per_serving DECIMAL(10,2),
    carbs_per_serving DECIMAL(10,2),
    fat_per_serving DECIMAL(10,2),
    fiber_per_serving DECIMAL(10,2),
    sugar_per_serving DECIMAL(10,2),
    sodium_per_serving DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Design

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Food Tracking Endpoints
```
GET    /api/food-entries                    # Get user's food entries (with pagination)
POST   /api/food-entries                    # Create new food entry
GET    /api/food-entries/:id                # Get specific food entry
PUT    /api/food-entries/:id                # Update food entry
DELETE /api/food-entries/:id                # Delete food entry
GET    /api/food-entries/summary            # Get daily/weekly/monthly summaries
```

### Mood Tracking Endpoints
```
GET    /api/mood-entries                    # Get user's mood entries (with pagination)
POST   /api/mood-entries                    # Create new mood entry
GET    /api/mood-entries/:id                # Get specific mood entry
PUT    /api/mood-entries/:id                # Update mood entry
DELETE /api/mood-entries/:id                # Delete mood entry
GET    /api/mood-entries/summary            # Get mood patterns and trends
```

### Analytics Endpoints
```
GET    /api/analytics/correlations          # Food-mood correlations
GET    /api/analytics/trends                # Long-term trends
GET    /api/analytics/insights              # AI-generated insights
GET    /api/analytics/export                # Export data (CSV/JSON)
```

### Food Database Endpoints
```
GET    /api/foods/search                    # Search food database
GET    /api/foods/:id                       # Get food details
POST   /api/foods                           # Add custom food (admin)
```

## Frontend Design

### Angular Components Structure

#### Core Modules
```
src/
├── app/
│   ├── core/                    # Core services, guards, interceptors
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── food.service.ts
│   │   │   ├── mood.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   └── interceptors/
│   │       └── auth.interceptor.ts
│   ├── shared/                  # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   ├── date-picker/
│   │   │   └── chart/
│   │   ├── pipes/
│   │   └── directives/
│   ├── features/
│   │   ├── auth/               # Authentication module
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── profile/
│   │   │   └── auth.module.ts
│   │   ├── food-tracking/      # Food tracking module
│   │   │   ├── components/
│   │   │   │   ├── food-entry-form/
│   │   │   │   ├── food-list/
│   │   │   │   ├── food-search/
│   │   │   │   └── nutrition-summary/
│   │   │   └── food-tracking.module.ts
│   │   ├── mood-tracking/      # Mood tracking module
│   │   │   ├── components/
│   │   │   │   ├── mood-entry-form/
│   │   │   │   ├── mood-list/
│   │   │   │   ├── mood-chart/
│   │   │   │   └── mood-calendar/
│   │   │   └── mood-tracking.module.ts
│   │   └── analytics/          # Analytics and insights module
│   │       ├── components/
│   │       │   ├── dashboard/
│   │       │   ├── correlations/
│   │       │   ├── trends/
│   │       │   └── insights/
│   │       └── analytics.module.ts
│   └── app.component.ts
```

### Key UI Components

#### Dashboard
- **Daily Summary Card**: Shows today's food intake and mood
- **Quick Entry Buttons**: Fast food and mood entry
- **Recent Activity**: Timeline of recent entries
- **Weekly Overview**: Mini charts showing trends

#### Food Tracking
- **Food Entry Form**: 
  - Search/select from food database
  - Quantity input with unit selection
  - Custom food creation
  - Photo upload capability
- **Food List**: 
  - Chronological list of entries
  - Edit/delete functionality
  - Nutritional breakdown
- **Nutrition Summary**:
  - Daily/weekly/monthly totals
  - Progress bars for macros
  - Calorie goals tracking

#### Mood Tracking
- **Mood Entry Form**:
  - Mood type selection (with emojis)
  - Rating scale (1-10)
  - Intensity slider
  - Duration input
  - Notes and triggers
- **Mood Calendar**:
  - Visual calendar with mood colors
  - Click to view/edit entries
- **Mood Charts**:
  - Line charts for trends
  - Bar charts for mood type distribution
  - Correlation heatmaps

#### Analytics
- **Correlation Analysis**:
  - Food-mood correlation matrix
  - Statistical significance indicators
  - Time-based correlations
- **Trend Analysis**:
  - Long-term mood trends
  - Seasonal patterns
  - Habit formation tracking
- **Insights**:
  - AI-generated recommendations
  - Pattern recognition
  - Goal suggestions

## Development Plan

### Phase 1: Foundation (Weeks 1-2)
1. **Project Setup**
   - Initialize Angular project with routing
   - Set up Node.js/Express backend with TypeScript
   - Configure MySQL database with Prisma/TypeORM
   - Set up authentication system

2. **Core Infrastructure**
   - User registration/login with JWT
   - Express.js middleware setup
   - MySQL database connection and migrations
   - Basic API endpoints with validation

### Phase 2: Food Tracking (Weeks 3-4)
1. **Backend**
   - Food entry CRUD operations
   - Food database integration
   - Nutritional calculations
   - Search functionality

2. **Frontend**
   - Food entry form
   - Food list component
   - Basic nutrition display
   - Food search functionality

### Phase 3: Mood Tracking (Weeks 5-6)
1. **Backend**
   - Mood entry CRUD operations
   - Mood analytics endpoints
   - Time-based queries

2. **Frontend**
   - Mood entry form
   - Mood calendar view
   - Basic mood charts
   - Mood list component

### Phase 4: Analytics & Insights (Weeks 7-8)
1. **Backend**
   - Correlation analysis algorithms
   - Trend calculation
   - Data export functionality
   - Performance optimization

2. **Frontend**
   - Dashboard implementation
   - Advanced charts and visualizations
   - Analytics views
   - Data export features

### Phase 5: Polish & Deployment (Weeks 9-10)
1. **Testing**
   - Unit tests for critical functions
   - Integration tests for API
   - E2E tests for user flows

2. **Deployment**
   - Production environment setup
   - CI/CD pipeline
   - Performance monitoring
   - User documentation

## Technical Considerations

### Security
- JWT token expiration and refresh
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- HTTPS enforcement
- Rate limiting

### Performance
- MySQL indexing strategy for food and mood queries
- Express.js response caching with Redis (optional)
- Angular lazy loading and code splitting
- Image optimization for food photos
- Bundle size optimization with webpack

### Scalability
- MySQL connection pooling with Prisma/TypeORM
- Express.js rate limiting middleware
- Horizontal scaling with PM2 cluster mode
- CDN for static assets
- Database read replicas for analytics queries

### Data Privacy
- GDPR compliance
- Data encryption at rest
- Secure data transmission
- User data export/deletion
- Privacy policy implementation

## Future Enhancements

### Phase 2 Features
- Mobile app (React Native/Flutter)
- Social features (sharing, challenges)
- Integration with fitness trackers
- Barcode scanning for food
- Voice input for quick entries
- AI-powered meal suggestions
- Integration with nutrition APIs
- Advanced analytics with machine learning

### Technical Improvements
- Real-time notifications
- Offline support
- Progressive Web App (PWA)
- Microservices architecture
- Event-driven architecture
- Advanced caching strategies

## Success Metrics

### User Engagement
- Daily active users
- Entry frequency
- Session duration
- Feature adoption rates

### Data Quality
- Entry completeness
- Data accuracy
- User retention
- Correlation discovery rate

### Technical Performance
- API response times
- Page load speeds
- Error rates
- System uptime

This design plan provides a comprehensive roadmap for building a robust food and mood tracking application with room for future growth and enhancement.
