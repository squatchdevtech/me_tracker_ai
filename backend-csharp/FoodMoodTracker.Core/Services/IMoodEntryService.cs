using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Services;

public interface IMoodEntryService
{
    Task<PagedResponse<MoodEntryResponse>> GetEntriesAsync(int userId, int page, int limit);
    Task<MoodEntryResponse?> GetEntryByIdAsync(int id, int userId);
    Task<MoodEntryResponse> CreateEntryAsync(int userId, MoodEntryRequest request);
    Task<MoodEntryResponse?> UpdateEntryAsync(int id, int userId, MoodEntryRequest request);
    Task<bool> DeleteEntryAsync(int id, int userId);
    Task<MoodSummaryResponse> GetSummaryAsync(int userId, DateTime? startDate, DateTime? endDate);
}

