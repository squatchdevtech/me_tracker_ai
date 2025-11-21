using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Services;

public interface IFoodEntryService
{
    Task<PagedResponse<FoodEntryResponse>> GetEntriesAsync(int userId, int page, int limit);
    Task<FoodEntryResponse?> GetEntryByIdAsync(int id, int userId);
    Task<FoodEntryResponse> CreateEntryAsync(int userId, FoodEntryRequest request);
    Task<FoodEntryResponse?> UpdateEntryAsync(int id, int userId, FoodEntryRequest request);
    Task<bool> DeleteEntryAsync(int id, int userId);
    Task<FoodSummaryResponse> GetSummaryAsync(int userId, string period, DateTime? date);
}

