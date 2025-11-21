using System.Text.Json;

namespace FoodMoodTracker.Core.DTOs;

public class FoodEntryRequest
{
    public string FoodName { get; set; } = string.Empty;
    public decimal? Quantity { get; set; }
    public string? Unit { get; set; }
    public JsonDocument? NutritionalData { get; set; }
    public DateTime ConsumedAt { get; set; }
    public string? Notes { get; set; }
}

public class FoodEntryResponse
{
    public int Id { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal? Quantity { get; set; }
    public string? Unit { get; set; }
    public JsonDocument? NutritionalData { get; set; }
    public DateTime ConsumedAt { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FoodSummaryResponse
{
    public string Period { get; set; } = string.Empty;
    public DateRange DateRange { get; set; } = new();
    public NutritionalSummary Summary { get; set; } = new();
    public List<FoodEntryResponse> Entries { get; set; } = new();
}

public class DateRange
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class NutritionalSummary
{
    public decimal TotalCalories { get; set; }
    public decimal TotalProtein { get; set; }
    public decimal TotalCarbs { get; set; }
    public decimal TotalFat { get; set; }
    public decimal TotalFiber { get; set; }
    public decimal TotalSugar { get; set; }
    public decimal TotalSodium { get; set; }
    public int EntryCount { get; set; }
}

public class FoodSearchResponse
{
    public List<FoodDatabaseResponse> Foods { get; set; } = new();
    public string Query { get; set; } = string.Empty;
    public int Total { get; set; }
}

public class FoodDatabaseResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Category { get; set; }
    public decimal? ServingSize { get; set; }
    public string? ServingUnit { get; set; }
    public decimal? CaloriesPerServing { get; set; }
    public decimal? ProteinPerServing { get; set; }
    public decimal? CarbsPerServing { get; set; }
    public decimal? FatPerServing { get; set; }
    public decimal? FiberPerServing { get; set; }
    public decimal? SugarPerServing { get; set; }
    public decimal? SodiumPerServing { get; set; }
}

