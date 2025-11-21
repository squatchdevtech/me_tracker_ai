using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;
using FoodMoodTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodMoodTracker.Infrastructure.Services;

public class FoodDatabaseService : IFoodDatabaseService
{
    private readonly ApplicationDbContext _context;

    public FoodDatabaseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<FoodSearchResponse> SearchFoodsAsync(string query, int limit)
    {
        var foods = await _context.FoodDatabase
            .Where(f => f.Name.Contains(query) || 
                       (f.Brand != null && f.Brand.Contains(query)) ||
                       (f.Category != null && f.Category.Contains(query)))
            .OrderBy(f => f.Name)
            .Take(limit)
            .ToListAsync();

        return new FoodSearchResponse
        {
            Foods = foods.Select(MapToResponse).ToList(),
            Query = query,
            Total = foods.Count
        };
    }

    public async Task<FoodDatabaseResponse?> GetFoodByIdAsync(int id)
    {
        var food = await _context.FoodDatabase.FindAsync(id);
        return food != null ? MapToResponse(food) : null;
    }

    private static FoodDatabaseResponse MapToResponse(Core.Models.FoodDatabase food)
    {
        return new FoodDatabaseResponse
        {
            Id = food.Id,
            Name = food.Name,
            Brand = food.Brand,
            Category = food.Category,
            ServingSize = food.ServingSize,
            ServingUnit = food.ServingUnit,
            CaloriesPerServing = food.CaloriesPerServing,
            ProteinPerServing = food.ProteinPerServing,
            CarbsPerServing = food.CarbsPerServing,
            FatPerServing = food.FatPerServing,
            FiberPerServing = food.FiberPerServing,
            SugarPerServing = food.SugarPerServing,
            SodiumPerServing = food.SodiumPerServing
        };
    }
}

