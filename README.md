# Food & Mood Tracker

A comprehensive application to track daily food intake and mood patterns, enabling users to identify correlations between their diet and emotional well-being.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd me_tracker_ai
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/health

## 📁 Project Structure

```
me_tracker_ai/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, error handling
│   │   └── index.ts        # Main server file
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # Angular 17+ application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── features/   # Feature modules
│   │   │   └── shared/     # Shared components
│   │   └── styles.scss
│   └── package.json
└── planning/               # Project documentation
    ├── design-plan.md
    ├── api-specification.md
    └── user-stories-wireframes.md
```

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Joi

### Frontend
- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **Styling**: SCSS
- **Charts**: Chart.js
- **State Management**: Angular Services

## 🎯 Features

### ✅ Implemented
- User authentication (register/login)
- Food entry tracking (CRUD operations)
- Mood entry tracking (CRUD operations)
- Basic analytics and correlations
- Responsive Material Design UI
- JWT-based security
- Database schema with Prisma

### 🚧 In Progress
- Advanced analytics dashboard
- Mood calendar visualization
- Food database integration
- Data export functionality

### 📋 Planned
- Mobile app (React Native/Flutter)
- Social features
- Barcode scanning
- AI-powered insights
- Integration with fitness trackers

## 📊 Database Schema

### Core Entities
- **Users**: User accounts and profiles
- **FoodEntries**: Individual food consumption records
- **MoodEntries**: Mood tracking records
- **FoodDatabase**: Nutritional information for foods

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Food Tracking
- `GET /api/food-entries` - Get user's food entries
- `POST /api/food-entries` - Create new food entry
- `PUT /api/food-entries/:id` - Update food entry
- `DELETE /api/food-entries/:id` - Delete food entry
- `GET /api/food-entries/summary` - Get food summary

### Mood Tracking
- `GET /api/mood-entries` - Get user's mood entries
- `POST /api/mood-entries` - Create new mood entry
- `PUT /api/mood-entries/:id` - Update mood entry
- `DELETE /api/mood-entries/:id` - Delete mood entry
- `GET /api/mood-entries/summary` - Get mood summary

### Analytics
- `GET /api/analytics/correlations` - Food-mood correlations
- `GET /api/analytics/trends` - Long-term trends
- `GET /api/analytics/insights` - AI-generated insights
- `GET /api/analytics/export` - Export data

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm test            # Run tests
npm run prisma:studio # Open database GUI
```

### Frontend Development
```bash
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet security headers

## 📈 Performance

- MySQL indexing for fast queries
- Angular lazy loading
- Code splitting
- Response caching
- Bundle optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in the `planning/` directory
- Review the API specification
- Open an issue on GitHub

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and architecture
- [x] User authentication
- [x] Basic food and mood tracking
- [x] Core API endpoints

### Phase 2: Enhanced Features 🚧
- [ ] Advanced analytics dashboard
- [ ] Mood calendar visualization
- [ ] Food database integration
- [ ] Data export functionality

### Phase 3: Mobile & Social 📋
- [ ] Mobile application
- [ ] Social features
- [ ] Barcode scanning
- [ ] AI-powered insights

---

Built with ❤️ for better health and well-being tracking.
