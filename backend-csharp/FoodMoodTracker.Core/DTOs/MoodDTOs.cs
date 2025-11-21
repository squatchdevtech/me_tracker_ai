using FoodMoodTracker.Core.Models;

namespace FoodMoodTracker.Core.DTOs;

public class MoodEntryRequest
{
    public int MoodRating { get; set; }
    public MoodType MoodType { get; set; }
    public decimal? Intensity { get; set; }
    public int? DurationMinutes { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? Notes { get; set; }
    public string? Triggers { get; set; }
}

public class MoodEntryResponse
{
    public int Id { get; set; }
    public int MoodRating { get; set; }
    public MoodType MoodType { get; set; }
    public decimal? Intensity { get; set; }
    public int? DurationMinutes { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? Notes { get; set; }
    public string? Triggers { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MoodSummaryResponse
{
    public DateRange Period { get; set; } = new();
    public decimal AverageMood { get; set; }
    public Dictionary<string, int> MoodDistribution { get; set; } = new();
    public MoodTrends Trends { get; set; } = new();
}

public class MoodTrends
{
    public List<decimal> WeeklyAverage { get; set; } = new();
    public Dictionary<string, object> DailyPatterns { get; set; } = new();
}

