# Food & Mood Tracker - Frontend

An Angular 17+ frontend application for tracking food intake and mood patterns with correlation analysis.

## Tech Stack

- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **Styling**: SCSS
- **Charts**: Chart.js with ng2-charts
- **State Management**: Angular Services
- **Routing**: Angular Router with lazy loading

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running on http://localhost:3000

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`

### 3. Build for Production

```bash
npm run build
```

## Project Structure

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
│   ├── features/
│   │   ├── auth/               # Authentication module
│   │   │   └── components/
│   │   │       ├── login/
│   │   │       ├── register/
│   │   │       └── profile/
│   │   ├── food-tracking/      # Food tracking module
│   │   │   └── components/
│   │   │       ├── food-entry-form/
│   │   │       ├── food-list/
│   │   │       ├── food-search/
│   │   │       └── nutrition-summary/
│   │   ├── mood-tracking/      # Mood tracking module
│   │   │   └── components/
│   │   │       ├── mood-entry-form/
│   │   │       ├── mood-list/
│   │   │       ├── mood-chart/
│   │   │       └── mood-calendar/
│   │   └── analytics/          # Analytics and insights module
│   │       └── components/
│   │           ├── dashboard/
│   │           ├── correlations/
│   │           ├── trends/
│   │           └── insights/
│   ├── app.component.ts
│   └── app.routes.ts
```

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes with auth guard
- User profile management

### Food Tracking
- Add, edit, and delete food entries
- Search food database
- Nutritional information display
- Daily/weekly/monthly summaries

### Mood Tracking
- Mood entry with rating (1-10) and type
- Mood calendar view
- Mood charts and trends
- Intensity and duration tracking

### Analytics
- Food-mood correlation analysis
- Trend visualization
- AI-generated insights
- Data export functionality

## Key Components

### Dashboard
- Daily summary cards
- Quick action buttons
- Recent activity timeline
- Insights and recommendations

### Food Tracking
- Food entry form with validation
- Food list with search and filtering
- Nutritional breakdown
- Progress tracking

### Mood Tracking
- Mood entry form with emoji selection
- Mood calendar with color coding
- Mood trend charts
- Pattern analysis

### Analytics
- Correlation matrix
- Trend analysis charts
- Insight recommendations
- Data export options

## Services

### AuthService
- User authentication and authorization
- Token management
- Profile updates

### FoodService
- Food entry CRUD operations
- Food database search
- Nutritional calculations

### MoodService
- Mood entry CRUD operations
- Mood analytics
- Mood type utilities

### AnalyticsService
- Correlation analysis
- Trend calculations
- Data export
- Insight generation

## Styling

The application uses Angular Material for UI components and custom SCSS for styling:

- Material Design components
- Responsive grid layout
- Custom color scheme for mood types
- Consistent spacing and typography

## Environment Configuration

The application expects the backend API to be running on `http://localhost:3000`. To change this, update the API_URL in the service files.

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run watch` - Build and watch for changes

## Contributing

1. Follow Angular best practices
2. Use TypeScript strict mode
3. Write tests for new components
4. Follow Material Design guidelines
5. Update documentation as needed
