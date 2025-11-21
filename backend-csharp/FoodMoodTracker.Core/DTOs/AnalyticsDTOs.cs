namespace FoodMoodTracker.Core.DTOs;

public class CorrelationsResponse
{
    public PeriodInfo Period { get; set; } = new();
    public List<FoodMoodCorrelation> Correlations { get; set; } = new();
    public int TotalFoodEntries { get; set; }
    public int TotalMoodEntries { get; set; }
}

public class PeriodInfo
{
    public int Days { get; set; }
    public DateTime StartDate { get; set; }
}

public class FoodMoodCorrelation
{
    public string FoodName { get; set; } = string.Empty;
    public decimal Correlation { get; set; }
    public int DataPoints { get; set; }
}

public class TrendsResponse
{
    public TrendPeriod Period { get; set; } = new();
    public TrendData Trends { get; set; } = new();
}

public class TrendPeriod
{
    public int Months { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class TrendData
{
    public MoodTrendData Mood { get; set; } = new();
    public FoodTrendData Food { get; set; } = new();
}

public class MoodTrendData
{
    public decimal AverageRating { get; set; }
    public string Trend { get; set; } = "stable";
    public Dictionary<string, int> MoodTypeDistribution { get; set; } = new();
}

public class FoodTrendData
{
    public int TotalEntries { get; set; }
    public decimal AverageEntriesPerDay { get; set; }
    public List<TopFood> TopFoods { get; set; } = new();
}

public class TopFood
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class InsightsResponse
{
    public PeriodInfo Period { get; set; } = new();
    public List<string> Insights { get; set; } = new();
}

public class ExportResponse
{
    public DateTime ExportDate { get; set; }
    public DateRange? DateRange { get; set; }
    public List<FoodEntryResponse> FoodEntries { get; set; } = new();
    public List<MoodEntryResponse> MoodEntries { get; set; } = new();
}

