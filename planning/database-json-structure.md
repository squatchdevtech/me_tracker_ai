# Database JSON Structure for Food Entries

## Overview

The food entries table now uses a JSON column (`nutritional_data`) to store nutritional information instead of individual columns. This provides flexibility and extensibility for future nutritional data requirements.

## JSON Structure

### Basic Nutritional Data
```json
{
  "calories": 95,
  "protein": 0.5,
  "carbs": 25,
  "fat": 0.3,
  "fiber": 4,
  "sugar": 19,
  "sodium": 2
}
```

### Extended Nutritional Data (Future)
```json
{
  "calories": 95,
  "protein": 0.5,
  "carbs": 25,
  "fat": 0.3,
  "fiber": 4,
  "sugar": 19,
  "sodium": 2,
  "vitamins": {
    "vitaminC": 8.4,
    "vitaminA": 54,
    "folate": 3
  },
  "minerals": {
    "potassium": 195,
    "calcium": 6,
    "iron": 0.12
  },
  "custom": {
    "caffeine": 0,
    "alcohol": 0
  }
}
```

## Benefits of JSON Approach

### 1. **Flexibility**
- Easy to add new nutritional fields without schema changes
- Support for custom nutritional data per food item
- Accommodate different food databases with varying data structures

### 2. **Extensibility**
- Future support for vitamins, minerals, and micronutrients
- Custom nutritional categories (caffeine, alcohol, etc.)
- Brand-specific nutritional variations

### 3. **Performance**
- MySQL 8.0+ has excellent JSON performance
- JSON indexing support for common queries
- Efficient storage for sparse nutritional data

### 4. **Development Speed**
- No database migrations for new nutritional fields
- Easier to integrate with external nutrition APIs
- Simplified data model for frontend consumption

## MySQL JSON Functions

### Querying Nutritional Data
```sql
-- Get all entries with calories > 100
SELECT * FROM food_entries 
WHERE JSON_EXTRACT(nutritional_data, '$.calories') > 100;

-- Get total calories for a user on a specific date
SELECT SUM(JSON_EXTRACT(nutritional_data, '$.calories')) as total_calories
FROM food_entries 
WHERE user_id = 1 AND DATE(consumed_at) = '2024-01-01';

-- Get entries with specific protein range
SELECT * FROM food_entries 
WHERE JSON_EXTRACT(nutritional_data, '$.protein') BETWEEN 10 AND 30;
```

### JSON Indexing
```sql
-- Create index on calories for performance
ALTER TABLE food_entries 
ADD INDEX idx_calories ((CAST(nutritional_data->>'$.calories' AS UNSIGNED)));

-- Create index on protein for performance
ALTER TABLE food_entries 
ADD INDEX idx_protein ((CAST(nutritional_data->>'$.protein' AS DECIMAL(10,2))));
```

## API Integration

### Node.js/Express with Prisma
```typescript
// Prisma schema
model FoodEntry {
  id               Int      @id @default(autoincrement())
  userId           Int
  foodName         String
  quantity         Decimal?
  unit             String?
  nutritionalData  Json?    // JSON column
  consumedAt       DateTime
  notes            String?
  createdAt        DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// TypeScript interface
interface NutritionalData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: {
    vitaminC?: number;
    vitaminA?: number;
    folate?: number;
  };
  minerals?: {
    potassium?: number;
    calcium?: number;
    iron?: number;
  };
  custom?: Record<string, number>;
}
```

### Express.js Route Example
```typescript
// Create food entry
app.post('/api/food-entries', async (req, res) => {
  const { foodName, quantity, unit, nutritionalData, consumedAt, notes } = req.body;
  
  const foodEntry = await prisma.foodEntry.create({
    data: {
      userId: req.user.id,
      foodName,
      quantity,
      unit,
      nutritionalData, // Stored as JSON
      consumedAt: new Date(consumedAt),
      notes
    }
  });
  
  res.json({ success: true, data: foodEntry });
});

// Get daily summary with JSON aggregation
app.get('/api/food-entries/summary', async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;
  
  const entries = await prisma.foodEntry.findMany({
    where: {
      userId,
      consumedAt: {
        gte: new Date(date + 'T00:00:00Z'),
        lt: new Date(date + 'T23:59:59Z')
      }
    }
  });
  
  // Calculate totals from JSON data
  const totals = entries.reduce((acc, entry) => {
    const data = entry.nutritionalData as NutritionalData;
    acc.calories += data.calories || 0;
    acc.protein += data.protein || 0;
    acc.carbs += data.carbs || 0;
    acc.fat += data.fat || 0;
    acc.fiber += data.fiber || 0;
    acc.sugar += data.sugar || 0;
    acc.sodium += data.sodium || 0;
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
  
  res.json({ success: true, data: { date, totals, entryCount: entries.length } });
});
```

## Migration Strategy

### From Individual Columns to JSON
```sql
-- Migration script to convert existing data
UPDATE food_entries 
SET nutritional_data = JSON_OBJECT(
  'calories', calories,
  'protein', protein,
  'carbs', carbs,
  'fat', fat,
  'fiber', fiber,
  'sugar', sugar,
  'sodium', sodium
)
WHERE nutritional_data IS NULL;

-- Drop old columns after migration
ALTER TABLE food_entries 
DROP COLUMN calories,
DROP COLUMN protein,
DROP COLUMN carbs,
DROP COLUMN fat,
DROP COLUMN fiber,
DROP COLUMN sugar,
DROP COLUMN sodium;
```

## Best Practices

### 1. **Validation**
- Validate JSON structure in application layer
- Use TypeScript interfaces for type safety
- Implement JSON schema validation

### 2. **Indexing**
- Create indexes on frequently queried JSON fields
- Use generated columns for complex queries
- Monitor query performance

### 3. **Data Integrity**
- Set default values for missing nutritional data
- Implement data validation rules
- Handle null/undefined values gracefully

### 4. **API Design**
- Provide consistent JSON structure in responses
- Include data validation in request/response schemas
- Document JSON field requirements

This JSON approach provides the flexibility needed for a comprehensive food tracking application while maintaining good performance and development velocity.
