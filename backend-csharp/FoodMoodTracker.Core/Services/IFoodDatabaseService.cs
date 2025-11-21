using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Services;

public interface IFoodDatabaseService
{
    Task<FoodSearchResponse> SearchFoodsAsync(string query, int limit);
    Task<FoodDatabaseResponse?> GetFoodByIdAsync(int id);
}

