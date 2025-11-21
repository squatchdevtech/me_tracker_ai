import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleFoods = [
  // Fruits
  {
    name: 'Apple',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 95,
    proteinPerServing: 0.5,
    carbsPerServing: 25,
    fatPerServing: 0.3,
    fiberPerServing: 4,
    sugarPerServing: 19,
    sodiumPerServing: 2
  },
  {
    name: 'Banana',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 105,
    proteinPerServing: 1.3,
    carbsPerServing: 27,
    fatPerServing: 0.4,
    fiberPerServing: 3.1,
    sugarPerServing: 14,
    sodiumPerServing: 1
  },
  {
    name: 'Orange',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 62,
    proteinPerServing: 1.2,
    carbsPerServing: 15,
    fatPerServing: 0.2,
    fiberPerServing: 3.1,
    sugarPerServing: 12,
    sodiumPerServing: 0
  },
  {
    name: 'Strawberries',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 49,
    proteinPerServing: 1,
    carbsPerServing: 12,
    fatPerServing: 0.5,
    fiberPerServing: 3,
    sugarPerServing: 7,
    sodiumPerServing: 1
  },
  {
    name: 'Blueberries',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 84,
    proteinPerServing: 1.1,
    carbsPerServing: 21,
    fatPerServing: 0.5,
    fiberPerServing: 3.6,
    sugarPerServing: 15,
    sodiumPerServing: 1
  },
  {
    name: 'Grapes',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 62,
    proteinPerServing: 0.6,
    carbsPerServing: 16,
    fatPerServing: 0.2,
    fiberPerServing: 0.8,
    sugarPerServing: 15,
    sodiumPerServing: 2
  },
  {
    name: 'Avocado',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 234,
    proteinPerServing: 2.9,
    carbsPerServing: 12,
    fatPerServing: 21,
    fiberPerServing: 9.2,
    sugarPerServing: 0.4,
    sodiumPerServing: 10
  },
  {
    name: 'Mango',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 99,
    proteinPerServing: 1.4,
    carbsPerServing: 25,
    fatPerServing: 0.6,
    fiberPerServing: 2.6,
    sugarPerServing: 23,
    sodiumPerServing: 2
  },
  {
    name: 'Pineapple',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 82,
    proteinPerServing: 0.9,
    carbsPerServing: 22,
    fatPerServing: 0.2,
    fiberPerServing: 2.3,
    sugarPerServing: 16,
    sodiumPerServing: 2
  },
  {
    name: 'Watermelon',
    category: 'Fruits',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 46,
    proteinPerServing: 0.9,
    carbsPerServing: 12,
    fatPerServing: 0.2,
    fiberPerServing: 0.6,
    sugarPerServing: 10,
    sodiumPerServing: 2
  },

  // Vegetables
  {
    name: 'Broccoli',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 55,
    proteinPerServing: 4.3,
    carbsPerServing: 11,
    fatPerServing: 0.6,
    fiberPerServing: 5.1,
    sugarPerServing: 2.6,
    sodiumPerServing: 33
  },
  {
    name: 'Spinach',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 7,
    proteinPerServing: 0.9,
    carbsPerServing: 1.1,
    fatPerServing: 0.1,
    fiberPerServing: 0.7,
    sugarPerServing: 0.1,
    sodiumPerServing: 24
  },
  {
    name: 'Carrots',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 52,
    proteinPerServing: 1.2,
    carbsPerServing: 12,
    fatPerServing: 0.3,
    fiberPerServing: 3.6,
    sugarPerServing: 6,
    sodiumPerServing: 88
  },
  {
    name: 'Sweet Potato',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 103,
    proteinPerServing: 2.3,
    carbsPerServing: 24,
    fatPerServing: 0.2,
    fiberPerServing: 3.8,
    sugarPerServing: 7.4,
    sodiumPerServing: 41
  },
  {
    name: 'Bell Pepper',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 31,
    proteinPerServing: 1,
    carbsPerServing: 7,
    fatPerServing: 0.3,
    fiberPerServing: 2.5,
    sugarPerServing: 5,
    sodiumPerServing: 4
  },
  {
    name: 'Tomato',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 22,
    proteinPerServing: 1.1,
    carbsPerServing: 5,
    fatPerServing: 0.2,
    fiberPerServing: 1.5,
    sugarPerServing: 3.2,
    sodiumPerServing: 5
  },
  {
    name: 'Cucumber',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 16,
    proteinPerServing: 0.7,
    carbsPerServing: 4,
    fatPerServing: 0.1,
    fiberPerServing: 0.5,
    sugarPerServing: 2,
    sodiumPerServing: 2
  },
  {
    name: 'Kale',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 33,
    proteinPerServing: 2.9,
    carbsPerServing: 6,
    fatPerServing: 0.6,
    fiberPerServing: 2.6,
    sugarPerServing: 0.8,
    sodiumPerServing: 30
  },
  {
    name: 'Cauliflower',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 27,
    proteinPerServing: 2.1,
    carbsPerServing: 5,
    fatPerServing: 0.3,
    fiberPerServing: 2.1,
    sugarPerServing: 2,
    sodiumPerServing: 32
  },
  {
    name: 'Zucchini',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 20,
    proteinPerServing: 1.5,
    carbsPerServing: 4,
    fatPerServing: 0.2,
    fiberPerServing: 1.4,
    sugarPerServing: 3,
    sodiumPerServing: 8
  },
  {
    name: 'Asparagus',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 27,
    proteinPerServing: 3,
    carbsPerServing: 5,
    fatPerServing: 0.2,
    fiberPerServing: 2.8,
    sugarPerServing: 2.5,
    sodiumPerServing: 3
  },
  {
    name: 'Brussels Sprouts',
    category: 'Vegetables',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 38,
    proteinPerServing: 3,
    carbsPerServing: 8,
    fatPerServing: 0.3,
    fiberPerServing: 3.3,
    sugarPerServing: 2,
    sodiumPerServing: 22
  },

  // Grains
  {
    name: 'Brown Rice',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 216,
    proteinPerServing: 5,
    carbsPerServing: 45,
    fatPerServing: 1.8,
    fiberPerServing: 3.5,
    sugarPerServing: 0.7,
    sodiumPerServing: 10
  },
  {
    name: 'White Rice',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 205,
    proteinPerServing: 4.3,
    carbsPerServing: 45,
    fatPerServing: 0.4,
    fiberPerServing: 0.6,
    sugarPerServing: 0.1,
    sodiumPerServing: 2
  },
  {
    name: 'Oatmeal',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 154,
    proteinPerServing: 5.3,
    carbsPerServing: 28,
    fatPerServing: 2.6,
    fiberPerServing: 4,
    sugarPerServing: 0.6,
    sodiumPerServing: 2
  },
  {
    name: 'Quinoa',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 222,
    proteinPerServing: 8,
    carbsPerServing: 39,
    fatPerServing: 3.6,
    fiberPerServing: 5,
    sugarPerServing: 0,
    sodiumPerServing: 13
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'slice',
    caloriesPerServing: 81,
    proteinPerServing: 4,
    carbsPerServing: 14,
    fatPerServing: 1.1,
    fiberPerServing: 2,
    sugarPerServing: 2,
    sodiumPerServing: 170
  },
  {
    name: 'Pasta',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 221,
    proteinPerServing: 8,
    carbsPerServing: 43,
    fatPerServing: 1.3,
    fiberPerServing: 2.5,
    sugarPerServing: 0.6,
    sodiumPerServing: 1
  },
  {
    name: 'Whole Wheat Pasta',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 174,
    proteinPerServing: 7.5,
    carbsPerServing: 37,
    fatPerServing: 0.8,
    fiberPerServing: 6,
    sugarPerServing: 0.4,
    sodiumPerServing: 8
  },
  {
    name: 'Barley',
    category: 'Grains',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 193,
    proteinPerServing: 3.6,
    carbsPerServing: 44,
    fatPerServing: 0.7,
    fiberPerServing: 6,
    sugarPerServing: 0.4,
    sodiumPerServing: 5
  },

  // Protein - Meat
  {
    name: 'Chicken Breast',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 165,
    proteinPerServing: 31,
    carbsPerServing: 0,
    fatPerServing: 3.6,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 74
  },
  {
    name: 'Chicken Thigh',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 209,
    proteinPerServing: 26,
    carbsPerServing: 0,
    fatPerServing: 10,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 84
  },
  {
    name: 'Ground Beef',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 250,
    proteinPerServing: 26,
    carbsPerServing: 0,
    fatPerServing: 17,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 72
  },
  {
    name: 'Lean Ground Beef',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 172,
    proteinPerServing: 27,
    carbsPerServing: 0,
    fatPerServing: 7,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 75
  },
  {
    name: 'Pork Tenderloin',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 143,
    proteinPerServing: 26,
    carbsPerServing: 0,
    fatPerServing: 3.5,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 62
  },
  {
    name: 'Turkey Breast',
    category: 'Meat',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 135,
    proteinPerServing: 30,
    carbsPerServing: 0,
    fatPerServing: 1,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 55
  },

  // Protein - Fish
  {
    name: 'Salmon',
    category: 'Fish',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 208,
    proteinPerServing: 25,
    carbsPerServing: 0,
    fatPerServing: 12,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 59
  },
  {
    name: 'Tuna',
    category: 'Fish',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 144,
    proteinPerServing: 30,
    carbsPerServing: 0,
    fatPerServing: 1,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 43
  },
  {
    name: 'Cod',
    category: 'Fish',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 82,
    proteinPerServing: 18,
    carbsPerServing: 0,
    fatPerServing: 0.7,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 54
  },
  {
    name: 'Shrimp',
    category: 'Fish',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 99,
    proteinPerServing: 24,
    carbsPerServing: 0.2,
    fatPerServing: 0.3,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 111
  },
  {
    name: 'Tilapia',
    category: 'Fish',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 128,
    proteinPerServing: 26,
    carbsPerServing: 0,
    fatPerServing: 2.7,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 56
  },

  // Dairy
  {
    name: 'Greek Yogurt',
    brand: 'Chobani',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 100,
    proteinPerServing: 17,
    carbsPerServing: 6,
    fatPerServing: 0,
    fiberPerServing: 0,
    sugarPerServing: 6,
    sodiumPerServing: 50
  },
  {
    name: 'Greek Yogurt',
    brand: 'Fage',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 130,
    proteinPerServing: 20,
    carbsPerServing: 9,
    fatPerServing: 0,
    fiberPerServing: 0,
    sugarPerServing: 9,
    sodiumPerServing: 65
  },
  {
    name: 'Milk',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 149,
    proteinPerServing: 8,
    carbsPerServing: 12,
    fatPerServing: 8,
    fiberPerServing: 0,
    sugarPerServing: 12,
    sodiumPerServing: 105
  },
  {
    name: 'Skim Milk',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 83,
    proteinPerServing: 8,
    carbsPerServing: 12,
    fatPerServing: 0.2,
    fiberPerServing: 0,
    sugarPerServing: 12,
    sodiumPerServing: 103
  },
  {
    name: 'Eggs',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'large',
    caloriesPerServing: 70,
    proteinPerServing: 6,
    carbsPerServing: 0.6,
    fatPerServing: 5,
    fiberPerServing: 0,
    sugarPerServing: 0.6,
    sodiumPerServing: 70
  },
  {
    name: 'Cheddar Cheese',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 113,
    proteinPerServing: 7,
    carbsPerServing: 0.4,
    fatPerServing: 9,
    fiberPerServing: 0,
    sugarPerServing: 0.1,
    sodiumPerServing: 174
  },
  {
    name: 'Cottage Cheese',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 163,
    proteinPerServing: 28,
    carbsPerServing: 6,
    fatPerServing: 2.3,
    fiberPerServing: 0,
    sugarPerServing: 6,
    sodiumPerServing: 918
  },
  {
    name: 'Mozzarella Cheese',
    category: 'Dairy',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 85,
    proteinPerServing: 6,
    carbsPerServing: 1,
    fatPerServing: 6,
    fiberPerServing: 0,
    sugarPerServing: 0.5,
    sodiumPerServing: 176
  },

  // Nuts & Seeds
  {
    name: 'Almonds',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 164,
    proteinPerServing: 6,
    carbsPerServing: 6,
    fatPerServing: 14,
    fiberPerServing: 3.5,
    sugarPerServing: 1.2,
    sodiumPerServing: 1
  },
  {
    name: 'Walnuts',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 185,
    proteinPerServing: 4.3,
    carbsPerServing: 4,
    fatPerServing: 18,
    fiberPerServing: 1.9,
    sugarPerServing: 0.7,
    sodiumPerServing: 1
  },
  {
    name: 'Peanuts',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 161,
    proteinPerServing: 7.3,
    carbsPerServing: 4.6,
    fatPerServing: 14,
    fiberPerServing: 2.4,
    sugarPerServing: 1.2,
    sodiumPerServing: 5
  },
  {
    name: 'Cashews',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 157,
    proteinPerServing: 5.2,
    carbsPerServing: 9,
    fatPerServing: 12,
    fiberPerServing: 0.9,
    sugarPerServing: 1.7,
    sodiumPerServing: 3
  },
  {
    name: 'Chia Seeds',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 138,
    proteinPerServing: 4.7,
    carbsPerServing: 12,
    fatPerServing: 8.7,
    fiberPerServing: 9.8,
    sugarPerServing: 0,
    sodiumPerServing: 5
  },
  {
    name: 'Flax Seeds',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 151,
    proteinPerServing: 5.2,
    carbsPerServing: 8,
    fatPerServing: 12,
    fiberPerServing: 7.6,
    sugarPerServing: 0.4,
    sodiumPerServing: 8
  },
  {
    name: 'Sunflower Seeds',
    category: 'Nuts',
    servingSize: 1,
    servingUnit: 'oz',
    caloriesPerServing: 164,
    proteinPerServing: 5.5,
    carbsPerServing: 6.5,
    fatPerServing: 14,
    fiberPerServing: 3,
    sugarPerServing: 0.5,
    sodiumPerServing: 1
  },

  // Legumes
  {
    name: 'Black Beans',
    category: 'Legumes',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 227,
    proteinPerServing: 15,
    carbsPerServing: 41,
    fatPerServing: 0.9,
    fiberPerServing: 15,
    sugarPerServing: 0.6,
    sodiumPerServing: 2
  },
  {
    name: 'Chickpeas',
    category: 'Legumes',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 269,
    proteinPerServing: 14.5,
    carbsPerServing: 45,
    fatPerServing: 4.2,
    fiberPerServing: 12.5,
    sugarPerServing: 8,
    sodiumPerServing: 11
  },
  {
    name: 'Lentils',
    category: 'Legumes',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 230,
    proteinPerServing: 18,
    carbsPerServing: 40,
    fatPerServing: 0.8,
    fiberPerServing: 15.6,
    sugarPerServing: 3.6,
    sodiumPerServing: 4
  },
  {
    name: 'Kidney Beans',
    category: 'Legumes',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 225,
    proteinPerServing: 15,
    carbsPerServing: 40,
    fatPerServing: 0.9,
    fiberPerServing: 13,
    sugarPerServing: 0.6,
    sodiumPerServing: 2
  },

  // Beverages
  {
    name: 'Water',
    category: 'Beverages',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 0,
    proteinPerServing: 0,
    carbsPerServing: 0,
    fatPerServing: 0,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 0
  },
  {
    name: 'Green Tea',
    category: 'Beverages',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 2,
    proteinPerServing: 0,
    carbsPerServing: 0,
    fatPerServing: 0,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 2
  },
  {
    name: 'Black Coffee',
    category: 'Beverages',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 2,
    proteinPerServing: 0.3,
    carbsPerServing: 0,
    fatPerServing: 0,
    fiberPerServing: 0,
    sugarPerServing: 0,
    sodiumPerServing: 5
  },
  {
    name: 'Orange Juice',
    category: 'Beverages',
    servingSize: 1,
    servingUnit: 'cup',
    caloriesPerServing: 112,
    proteinPerServing: 1.7,
    carbsPerServing: 26,
    fatPerServing: 0.5,
    fiberPerServing: 0.5,
    sugarPerServing: 21,
    sodiumPerServing: 2
  }
];

async function seedFoodDatabase() {
  console.log('🌱 Seeding food database...');

  try {
    // Clear existing food database
    await prisma.foodDatabase.deleteMany();
    console.log('✅ Cleared existing food database');

    // Insert sample foods
    for (const food of sampleFoods) {
      await prisma.foodDatabase.create({
        data: food
      });
    }

    console.log(`✅ Seeded ${sampleFoods.length} foods into the database`);
  } catch (error) {
    console.error('❌ Error seeding food database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedFoodDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
