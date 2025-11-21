using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Services;

public interface IAnalyticsService
{
    Task<CorrelationsResponse> GetCorrelationsAsync(int userId, int days);
    Task<TrendsResponse> GetTrendsAsync(int userId, string period, int months);
    Task<InsightsResponse> GetInsightsAsync(int userId, int days);
    Task<ExportResponse> ExportDataAsync(int userId, DateTime? startDate, DateTime? endDate);
}

