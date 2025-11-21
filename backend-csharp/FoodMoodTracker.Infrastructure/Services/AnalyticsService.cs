using System.Text.Json;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Models;
using FoodMoodTracker.Core.Services;
using FoodMoodTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodMoodTracker.Infrastructure.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ApplicationDbContext _context;

    public AnalyticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CorrelationsResponse> GetCorrelationsAsync(int userId, int days)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);

        var foodEntries = await _context.FoodEntries
            .Where(e => e.UserId == userId && e.ConsumedAt >= startDate)
            .OrderBy(e => e.ConsumedAt)
            .ToListAsync();

        var moodEntries = await _context.MoodEntries
            .Where(e => e.UserId == userId && e.StartedAt >= startDate)
            .OrderBy(e => e.StartedAt)
            .ToListAsync();

        var correlations = AnalyzeCorrelations(foodEntries, moodEntries);

        return new CorrelationsResponse
        {
            Period = new PeriodInfo { Days = days, StartDate = startDate },
            Correlations = correlations,
            TotalFoodEntries = foodEntries.Count,
            TotalMoodEntries = moodEntries.Count
        };
    }

    public async Task<TrendsResponse> GetTrendsAsync(int userId, string period, int months)
    {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);

        var moodEntries = await _context.MoodEntries
            .Where(e => e.UserId == userId && e.StartedAt >= startDate && e.StartedAt <= endDate)
            .OrderBy(e => e.StartedAt)
            .ToListAsync();

        var foodEntries = await _context.FoodEntries
            .Where(e => e.UserId == userId && e.ConsumedAt >= startDate && e.ConsumedAt <= endDate)
            .OrderBy(e => e.ConsumedAt)
            .ToListAsync();

        var trends = AnalyzeTrends(moodEntries, foodEntries, period);

        return new TrendsResponse
        {
            Period = new TrendPeriod
            {
                Months = months,
                StartDate = startDate,
                EndDate = endDate
            },
            Trends = trends
        };
    }

    public async Task<InsightsResponse> GetInsightsAsync(int userId, int days)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);

        var foodEntries = await _context.FoodEntries
            .Where(e => e.UserId == userId && e.ConsumedAt >= startDate)
            .ToListAsync();

        var moodEntries = await _context.MoodEntries
            .Where(e => e.UserId == userId && e.StartedAt >= startDate)
            .ToListAsync();

        var insights = GenerateInsights(foodEntries, moodEntries);

        return new InsightsResponse
        {
            Period = new PeriodInfo { Days = days, StartDate = startDate },
            Insights = insights
        };
    }

    public async Task<ExportResponse> ExportDataAsync(int userId, DateTime? startDate, DateTime? endDate)
    {
        var foodQuery = _context.FoodEntries.Where(e => e.UserId == userId);
        var moodQuery = _context.MoodEntries.Where(e => e.UserId == userId);

        if (startDate.HasValue)
        {
            foodQuery = foodQuery.Where(e => e.CreatedAt >= startDate.Value);
            moodQuery = moodQuery.Where(e => e.CreatedAt >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            foodQuery = foodQuery.Where(e => e.CreatedAt <= endDate.Value);
            moodQuery = moodQuery.Where(e => e.CreatedAt <= endDate.Value);
        }

        var foodEntries = await foodQuery.OrderBy(e => e.ConsumedAt).ToListAsync();
        var moodEntries = await moodQuery.OrderBy(e => e.StartedAt).ToListAsync();

        return new ExportResponse
        {
            ExportDate = DateTime.UtcNow,
            DateRange = startDate.HasValue || endDate.HasValue
                ? new DateRange
                {
                    StartDate = startDate ?? foodEntries.FirstOrDefault()?.CreatedAt ?? DateTime.UtcNow,
                    EndDate = endDate ?? moodEntries.LastOrDefault()?.CreatedAt ?? DateTime.UtcNow
                }
                : null,
            FoodEntries = foodEntries.Select(MapFoodEntry).ToList(),
            MoodEntries = moodEntries.Select(MapMoodEntry).ToList()
        };
    }

    private static List<FoodMoodCorrelation> AnalyzeCorrelations(List<FoodEntry> foodEntries, List<MoodEntry> moodEntries)
    {
        var correlations = new List<FoodMoodCorrelation>();
        var dailyData = new Dictionary<string, DailyData>();

        foreach (var entry in foodEntries)
        {
            var date = entry.ConsumedAt.Date.ToString("yyyy-MM-dd");
            if (!dailyData.ContainsKey(date))
                dailyData[date] = new DailyData();

            dailyData[date].FoodEntries.Add(entry);
        }

        foreach (var entry in moodEntries)
        {
            var date = entry.StartedAt.Date.ToString("yyyy-MM-dd");
            if (!dailyData.ContainsKey(date))
                dailyData[date] = new DailyData();

            dailyData[date].MoodEntries.Add(entry);
        }

        var foodTypes = new Dictionary<string, List<decimal>>();
        var moodRatings = new List<decimal>();

        foreach (var day in dailyData.Values)
        {
            if (day.MoodEntries.Count > 0)
            {
                var avgMood = day.MoodEntries.Average(m => m.MoodRating);
                moodRatings.Add((decimal)avgMood);

                foreach (var food in day.FoodEntries)
                {
                    if (!foodTypes.ContainsKey(food.FoodName))
                        foodTypes[food.FoodName] = new List<decimal>();

                    foodTypes[food.FoodName].Add((decimal)avgMood);
                }
            }
        }

        foreach (var (foodName, ratings) in foodTypes)
        {
            if (ratings.Count >= 3)
            {
                var correlation = CalculateCorrelation(ratings, moodRatings.Take(ratings.Count).ToList());
                correlations.Add(new FoodMoodCorrelation
                {
                    FoodName = foodName,
                    Correlation = Math.Round(correlation, 2),
                    DataPoints = ratings.Count
                });
            }
        }

        return correlations.OrderByDescending(c => Math.Abs(c.Correlation)).ToList();
    }

    private static TrendData AnalyzeTrends(List<MoodEntry> moodEntries, List<FoodEntry> foodEntries, string period)
    {
        var moodTrend = new MoodTrendData
        {
            AverageRating = moodEntries.Count > 0
                ? Math.Round((decimal)moodEntries.Average(e => e.MoodRating), 2)
                : 0,
            Trend = "stable",
            MoodTypeDistribution = moodEntries
                .GroupBy(e => e.MoodType.ToString())
                .ToDictionary(g => g.Key, g => g.Count())
        };

        var foodCounts = foodEntries
            .GroupBy(e => e.FoodName)
            .ToDictionary(g => g.Key, g => g.Count());

        var foodTrend = new FoodTrendData
        {
            TotalEntries = foodEntries.Count,
            AverageEntriesPerDay = foodEntries.Count > 0
                ? Math.Round((decimal)foodEntries.Count / (decimal)(foodEntries.Max(e => e.ConsumedAt.Date) - foodEntries.Min(e => e.ConsumedAt.Date)).TotalDays, 2)
                : 0,
            TopFoods = foodCounts
                .OrderByDescending(kvp => kvp.Value)
                .Take(10)
                .Select(kvp => new TopFood { Name = kvp.Key, Count = kvp.Value })
                .ToList()
        };

        return new TrendData
        {
            Mood = moodTrend,
            Food = foodTrend
        };
    }

    private static List<string> GenerateInsights(List<FoodEntry> foodEntries, List<MoodEntry> moodEntries)
    {
        var insights = new List<string>();

        if (moodEntries.Count == 0)
        {
            insights.Add("Start tracking your mood to get personalized insights!");
            return insights;
        }

        if (foodEntries.Count == 0)
        {
            insights.Add("Start tracking your food intake to discover correlations with your mood!");
            return insights;
        }

        var avgMood = moodEntries.Average(m => m.MoodRating);

        if (avgMood >= 7)
        {
            insights.Add("Your mood has been consistently positive! Keep up the great work.");
        }
        else if (avgMood <= 4)
        {
            insights.Add("Consider tracking what foods you eat when you feel better to identify positive patterns.");
        }

        var uniqueFoods = foodEntries.Select(f => f.FoodName).Distinct().Count();
        if (uniqueFoods < 5)
        {
            insights.Add("Try diversifying your diet - variety can positively impact your mood and health.");
        }

        return insights;
    }

    private static decimal CalculateCorrelation(List<decimal> x, List<decimal> y)
    {
        var n = Math.Min(x.Count, y.Count);
        if (n == 0) return 0;

        var sumX = x.Take(n).Sum();
        var sumY = y.Take(n).Sum();
        var sumXY = x.Take(n).Zip(y.Take(n), (a, b) => a * b).Sum();
        var sumX2 = x.Take(n).Sum(v => v * v);
        var sumY2 = y.Take(n).Sum(v => v * v);

        var numerator = n * sumXY - sumX * sumY;
        var denominator = (decimal)Math.Sqrt((double)((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)));

        return denominator == 0 ? 0 : numerator / denominator;
    }

    private static FoodEntryResponse MapFoodEntry(FoodEntry entry)
    {
        JsonDocument? nutritionalData = null;
        if (!string.IsNullOrEmpty(entry.NutritionalData))
        {
            try
            {
                nutritionalData = JsonDocument.Parse(entry.NutritionalData);
            }
            catch { }
        }

        return new FoodEntryResponse
        {
            Id = entry.Id,
            FoodName = entry.FoodName,
            Quantity = entry.Quantity,
            Unit = entry.Unit,
            NutritionalData = nutritionalData,
            ConsumedAt = entry.ConsumedAt,
            Notes = entry.Notes,
            CreatedAt = entry.CreatedAt
        };
    }

    private static MoodEntryResponse MapMoodEntry(MoodEntry entry)
    {
        return new MoodEntryResponse
        {
            Id = entry.Id,
            MoodRating = entry.MoodRating,
            MoodType = entry.MoodType,
            Intensity = entry.Intensity,
            DurationMinutes = entry.DurationMinutes,
            StartedAt = entry.StartedAt,
            EndedAt = entry.EndedAt,
            Notes = entry.Notes,
            Triggers = entry.Triggers,
            CreatedAt = entry.CreatedAt
        };
    }

    private class DailyData
    {
        public List<FoodEntry> FoodEntries { get; set; } = new();
        public List<MoodEntry> MoodEntries { get; set; } = new();
    }
}

