import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed food database with common foods
  const foods = [
    {
      name: 'Apple',
      category: 'Fruit',
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
      category: 'Fruit',
      servingSize: 1,
      servingUnit: 'medium',
      caloriesPerServing: 105,
      proteinPerServing: 1.3,
      carbsPerServing: 27,
      fatPerServing: 0.4,
      fiberPerServing: 3,
      sugarPerServing: 14,
      sodiumPerServing: 1
    },
    {
      name: 'Chicken Breast',
      category: 'Protein',
      servingSize: 100,
      servingUnit: 'grams',
      caloriesPerServing: 165,
      proteinPerServing: 31,
      carbsPerServing: 0,
      fatPerServing: 3.6,
      fiberPerServing: 0,
      sugarPerServing: 0,
      sodiumPerServing: 74
    },
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
      name: 'Broccoli',
      category: 'Vegetable',
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
      name: 'Salmon',
      category: 'Protein',
      servingSize: 100,
      servingUnit: 'grams',
      caloriesPerServing: 208,
      proteinPerServing: 25,
      carbsPerServing: 0,
      fatPerServing: 12,
      fiberPerServing: 0,
      sugarPerServing: 0,
      sodiumPerServing: 44
    },
    {
      name: 'Avocado',
      category: 'Fruit',
      servingSize: 1,
      servingUnit: 'medium',
      caloriesPerServing: 240,
      proteinPerServing: 3,
      carbsPerServing: 13,
      fatPerServing: 22,
      fiberPerServing: 10,
      sugarPerServing: 1,
      sodiumPerServing: 11
    },
    {
      name: 'Oatmeal',
      category: 'Grains',
      servingSize: 1,
      servingUnit: 'cup',
      caloriesPerServing: 154,
      proteinPerServing: 6,
      carbsPerServing: 28,
      fatPerServing: 3.2,
      fiberPerServing: 4,
      sugarPerServing: 1,
      sodiumPerServing: 7
    },
    {
      name: 'Greek Yogurt',
      category: 'Dairy',
      servingSize: 1,
      servingUnit: 'cup',
      caloriesPerServing: 130,
      proteinPerServing: 20,
      carbsPerServing: 9,
      fatPerServing: 0,
      fiberPerServing: 0,
      sugarPerServing: 9,
      sodiumPerServing: 50
    },
    {
      name: 'Almonds',
      category: 'Nuts',
      servingSize: 1,
      servingUnit: 'ounce',
      caloriesPerServing: 164,
      proteinPerServing: 6,
      carbsPerServing: 6,
      fatPerServing: 14,
      fiberPerServing: 3.5,
      sugarPerServing: 1,
      sodiumPerServing: 1
    },
    {
      name: 'Spinach',
      category: 'Vegetable',
      servingSize: 1,
      servingUnit: 'cup',
      caloriesPerServing: 7,
      proteinPerServing: 0.9,
      carbsPerServing: 1,
      fatPerServing: 0.1,
      fiberPerServing: 0.7,
      sugarPerServing: 0.1,
      sodiumPerServing: 24
    },
    {
      name: 'Sweet Potato',
      category: 'Vegetable',
      servingSize: 1,
      servingUnit: 'medium',
      caloriesPerServing: 112,
      proteinPerServing: 2,
      carbsPerServing: 26,
      fatPerServing: 0.1,
      fiberPerServing: 4,
      sugarPerServing: 5,
      sodiumPerServing: 41
    }
  ];

  console.log('📦 Seeding food database...');
  
  for (const food of foods) {
    await prisma.foodDatabase.upsert({
      where: { name: food.name },
      update: food,
      create: food
    });
  }

  console.log(`✅ Seeded ${foods.length} food items`);
  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
