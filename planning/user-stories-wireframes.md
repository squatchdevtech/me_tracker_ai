# User Stories & Wireframes

## User Stories

### Epic 1: User Authentication
**As a user, I want to create an account so that I can track my personal food and mood data.**

**User Stories:**
1. As a new user, I want to register with my email and password so that I can access the app
2. As a registered user, I want to login with my credentials so that I can access my data
3. As a user, I want to update my profile information so that my account stays current
4. As a user, I want to logout securely so that my data is protected

**Acceptance Criteria:**
- Registration form validates email format and password strength
- Login remembers user session with JWT tokens
- Profile updates are saved and reflected immediately
- Logout clears all session data

### Epic 2: Food Tracking
**As a user, I want to log what I eat so that I can track my nutrition and identify patterns.**

**User Stories:**
1. As a user, I want to search for foods in a database so that I can quickly log my meals
2. As a user, I want to specify the quantity and unit of food so that my nutrition data is accurate
3. As a user, I want to add custom foods so that I can track items not in the database
4. As a user, I want to see my daily nutrition summary so that I can monitor my intake
5. As a user, I want to edit or delete food entries so that I can correct mistakes
6. As a user, I want to see my food history so that I can review past meals

**Acceptance Criteria:**
- Food search returns relevant results with nutritional information
- Quantity input accepts decimal values with proper units
- Custom foods can be saved with complete nutritional data
- Daily summary shows totals for all macronutrients
- Edit/delete operations are confirmed before execution
- Food history is paginated and sortable by date

### Epic 3: Mood Tracking
**As a user, I want to log my mood and feelings so that I can identify emotional patterns.**

**User Stories:**
1. As a user, I want to rate my mood on a scale so that I can quantify my feelings
2. As a user, I want to select my mood type so that I can categorize my emotions
3. As a user, I want to specify how long I felt a certain way so that I can track duration
4. As a user, I want to add notes about what triggered my mood so that I can identify patterns
5. As a user, I want to see my mood on a calendar so that I can visualize patterns over time
6. As a user, I want to see mood trends so that I can understand my emotional patterns

**Acceptance Criteria:**
- Mood rating uses a clear 1-10 scale with visual indicators
- Mood types include common emotions with emoji representations
- Duration can be specified in minutes or hours
- Notes and triggers are saved with each mood entry
- Calendar view shows mood colors for each day
- Trend charts show mood patterns over time

### Epic 4: Analytics & Insights
**As a user, I want to see correlations between my food and mood so that I can make informed decisions.**

**User Stories:**
1. As a user, I want to see correlations between foods and moods so that I can identify triggers
2. As a user, I want to see my mood trends over time so that I can track progress
3. As a user, I want to receive insights about my patterns so that I can make better choices
4. As a user, I want to export my data so that I can analyze it externally
5. As a user, I want to see weekly and monthly summaries so that I can track long-term trends

**Acceptance Criteria:**
- Correlations show statistical significance and sample size
- Trend charts are interactive and show multiple time periods
- Insights are generated based on user's actual data patterns
- Data export includes all user data in CSV/JSON format
- Summaries aggregate data meaningfully across time periods

## Wireframes

### 1. Dashboard (Main Page)
```
┌─────────────────────────────────────────────────────────────┐
│ Food & Mood Tracker                    [Profile] [Logout]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Today's Food  │  │   Today's Mood  │  │ Quick Entry  │ │
│  │                 │  │                 │  │              │ │
│  │ Calories: 1,200 │  │ Average: 7/10   │  │ [+ Food]     │ │
│  │ Protein: 45g    │  │ Happy: 3 times  │  │ [+ Mood]     │ │
│  │ Carbs: 150g     │  │ Stressed: 1     │  │              │ │
│  │ Fat: 35g        │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Recent Activity                          │ │
│  │                                                         │ │
│  │ 2:30 PM - Logged mood: Happy (8/10)                    │ │
│  │ 1:15 PM - Ate: Chicken Salad (320 cal)                 │ │
│  │ 12:00 PM - Logged mood: Energetic (7/10)               │ │
│  │ 11:30 AM - Ate: Apple (95 cal)                         │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Weekly Trends  │  │  Quick Insights │                  │
│  │                 │  │                 │                  │
│  │ [Mood Chart]    │  │ • Fruits make   │                  │
│  │                 │  │   you happier   │                  │
│  │                 │  │ • High protein  │                  │
│  │                 │  │   = more energy │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Food Entry Form
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                    Add Food Entry       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Search for Food:                                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Apple...                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Search Results:                                        │ │
│  │                                                         │ │
│  │ 🍎 Apple, raw (medium) - 95 cal                        │ │
│  │ 🍎 Apple, Granny Smith (medium) - 80 cal               │ │
│  │ 🍎 Apple juice (1 cup) - 120 cal                       │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Quantity:                                                  │
│  ┌─────────┐  ┌─────────────┐                              │
│  │   1     │  │   medium    │                              │
│  └─────────┘  └─────────────┘                              │
│                                                             │
│  When did you eat this?                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Today, 2:30 PM                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Notes (optional):                                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Red delicious apple from the farmer's market           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     Cancel      │  │   Add Entry     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Mood Entry Form
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                    Add Mood Entry       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  How are you feeling?                                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Mood Rating: 7/10                                      │ │
│  │ ●●●●●●●○○○                                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  What type of mood?                                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 😊 Happy  😌 Calm  ⚡ Energetic  😴 Tired             │ │
│  │ 😰 Anxious 😤 Irritable  😌 Focused  😵 Confused      │ │
│  │ 😢 Sad  😤 Stressed                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  How intense is this feeling?                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Intensity: 80%                                         │ │
│  │ ●●●●●●●●○○                                             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  How long have you felt this way?                           │
│  ┌─────────┐  ┌─────────────┐                              │
│  │   2     │  │   hours     │                              │
│  └─────────┘  └─────────────┘                              │
│                                                             │
│  When did this start?                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Today, 1:00 PM                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  What might have caused this mood?                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Good conversation with friend, sunny weather           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Additional notes:                                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Feeling optimistic about the day ahead                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     Cancel      │  │   Add Entry     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Analytics & Insights                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Time Period: [Last 30 days ▼]                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Mood Trends                              │ │
│  │                                                         │ │
│  │ 10 ┤                                                   │ │
│  │  9 ┤     ●                                             │ │
│  │  8 ┤   ●   ●   ●                                       │ │
│  │  7 ┤ ●       ●   ●   ●                                 │ │
│  │  6 ┤           ●   ●   ●                               │ │
│  │  5 ┤                 ●                                 │ │
│  │  4 ┤                                                   │ │
│  │  3 ┤                                                   │ │
│  │  2 ┤                                                   │ │
│  │  1 ┤                                                   │ │
│  │  0 └─────────────────────────────────────────────────  │ │
│  │     Jan 1  Jan 8  Jan 15 Jan 22 Jan 29                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Food-Mood       │  │ Key Insights    │                  │
│  │ Correlations    │  │                 │                  │
│  │                 │  │ • Eating fruits │                  │
│  │ Fruits → Happy  │  │   increases     │                  │
│  │ 0.65 (p<0.05)   │  │   happiness by  │                  │
│  │                 │  │   23%           │                  │
│  │ Protein → Energy│  │                 │                  │
│  │ 0.45 (p<0.01)   │  │ • High sugar    │                  │
│  │                 │  │   leads to      │                  │
│  │ Sugar → Tired   │  │   energy crashes│                  │
│  │ 0.38 (p<0.05)   │  │                 │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Weekly Patterns                          │ │
│  │                                                         │ │
│  │ Mon  Tue  Wed  Thu  Fri  Sat  Sun                      │ │
│  │ 7.2  6.8  7.1  6.9  7.3  8.1  7.8                     │ │
│  │                                                         │ │
│  │ Best day: Saturday (8.1/10)                            │ │
│  │ Worst day: Tuesday (6.8/10)                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Export Data    │  │  Set Goals      │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 5. Food History
```
┌─────────────────────────────────────────────────────────────┐
│ Food History                    [Filter ▼] [Export ▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Today, January 15, 2024                                │ │
│  │                                                         │ │
│  │ 2:30 PM - Chicken Salad                                │ │
│  │         320 cal | 25g protein | 15g carbs | 18g fat    │ │
│  │         [Edit] [Delete]                                │ │
│  │                                                         │ │
│  │ 11:30 AM - Apple                                       │ │
│  │         95 cal | 0.5g protein | 25g carbs | 0.3g fat   │ │
│  │         [Edit] [Delete]                                │ │
│  │                                                         │ │
│  │ 8:00 AM - Oatmeal with Berries                         │ │
│  │         280 cal | 8g protein | 45g carbs | 6g fat      │ │
│  │         [Edit] [Delete]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Yesterday, January 14, 2024                            │ │
│  │                                                         │ │
│  │ 7:00 PM - Grilled Salmon                               │ │
│  │         350 cal | 35g protein | 0g carbs | 20g fat     │ │
│  │         [Edit] [Delete]                                │ │
│  │                                                         │ │
│  │ 12:00 PM - Quinoa Bowl                                 │ │
│  │         420 cal | 15g protein | 60g carbs | 12g fat    │ │
│  │         [Edit] [Delete]                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Load More     │  │   Add Entry     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## User Journey Map

### New User Onboarding
1. **Landing Page** → User discovers the app
2. **Registration** → User creates account
3. **Profile Setup** → User enters basic information
4. **Tutorial** → User learns how to log food and mood
5. **First Entry** → User logs their first food/mood entry
6. **Dashboard** → User sees their data and insights

### Daily Usage Flow
1. **Login** → User accesses the app
2. **Dashboard** → User sees today's summary
3. **Quick Entry** → User logs food or mood
4. **Review** → User checks their progress
5. **Insights** → User views correlations and trends

### Weekly Review Flow
1. **Analytics** → User reviews weekly patterns
2. **Insights** → User sees food-mood correlations
3. **Goal Setting** → User sets new targets
4. **Export** → User exports data for external analysis

## Success Metrics

### User Engagement
- Daily active users (target: 70% of registered users)
- Average session duration (target: 5+ minutes)
- Feature adoption rate (target: 80% use both food and mood tracking)
- User retention (target: 60% after 30 days)

### Data Quality
- Average entries per user per day (target: 3+ food, 2+ mood)
- Data completeness (target: 90% of entries have all fields)
- User accuracy (target: <5% edit/delete rate)

### Business Value
- User satisfaction score (target: 4.5/5)
- Feature request completion rate
- Support ticket volume (target: <5% of users)
- Data export usage (target: 20% of users)
