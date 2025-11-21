using System.Text.Json;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Models;
using FoodMoodTracker.Core.Services;
using FoodMoodTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodMoodTracker.Infrastructure.Services;

public class FoodEntryService : IFoodEntryService
{
    private readonly ApplicationDbContext _context;

    public FoodEntryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<FoodEntryResponse>> GetEntriesAsync(int userId, int page, int limit)
    {
        var skip = (page - 1) * limit;

        var query = _context.FoodEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.ConsumedAt);

        var total = await query.CountAsync();
        var entries = await query
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        return new PagedResponse<FoodEntryResponse>
        {
            Items = entries.Select(MapToResponse).ToList(),
            Pagination = new PaginationInfo
            {
                Page = page,
                Limit = limit,
                Total = total,
                Pages = (int)Math.Ceiling(total / (double)limit)
            }
        };
    }

    public async Task<FoodEntryResponse?> GetEntryByIdAsync(int id, int userId)
    {
        var entry = await _context.FoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        return entry != null ? MapToResponse(entry) : null;
    }

    public async Task<FoodEntryResponse> CreateEntryAsync(int userId, FoodEntryRequest request)
    {
        var entry = new FoodEntry
        {
            UserId = userId,
            FoodName = request.FoodName,
            Quantity = request.Quantity,
            Unit = request.Unit,
            NutritionalData = request.NutritionalData?.RootElement.GetRawText(),
            ConsumedAt = request.ConsumedAt,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.FoodEntries.Add(entry);
        await _context.SaveChangesAsync();

        return MapToResponse(entry);
    }

    public async Task<FoodEntryResponse?> UpdateEntryAsync(int id, int userId, FoodEntryRequest request)
    {
        var entry = await _context.FoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return null;
        }

        entry.FoodName = request.FoodName;
        entry.Quantity = request.Quantity;
        entry.Unit = request.Unit;
        entry.NutritionalData = request.NutritionalData?.RootElement.GetRawText();
        entry.ConsumedAt = request.ConsumedAt;
        entry.Notes = request.Notes;

        await _context.SaveChangesAsync();

        return MapToResponse(entry);
    }

    public async Task<bool> DeleteEntryAsync(int id, int userId)
    {
        var entry = await _context.FoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return false;
        }

        _context.FoodEntries.Remove(entry);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<FoodSummaryResponse> GetSummaryAsync(int userId, string period, DateTime? date)
    {
        var targetDate = date ?? DateTime.UtcNow;
        DateTime startDate, endDate;

        switch (period.ToLower())
        {
            case "daily":
                startDate = new DateTime(targetDate.Year, targetDate.Month, targetDate.Day, 0, 0, 0);
                endDate = new DateTime(targetDate.Year, targetDate.Month, targetDate.Day, 23, 59, 59);
                break;
            case "weekly":
                var dayOfWeek = (int)targetDate.DayOfWeek;
                startDate = targetDate.AddDays(-dayOfWeek).Date;
                endDate = startDate.AddDays(6).Date.AddHours(23).AddMinutes(59).AddSeconds(59);
                break;
            case "monthly":
                startDate = new DateTime(targetDate.Year, targetDate.Month, 1);
                endDate = new DateTime(targetDate.Year, targetDate.Month, DateTime.DaysInMonth(targetDate.Year, targetDate.Month), 23, 59, 59);
                break;
            default:
                throw new ArgumentException("Invalid period. Use daily, weekly, or monthly");
        }

        var entries = await _context.FoodEntries
            .Where(e => e.UserId == userId && e.ConsumedAt >= startDate && e.ConsumedAt <= endDate)
            .OrderBy(e => e.ConsumedAt)
            .ToListAsync();

        var summary = CalculateNutritionalSummary(entries);

        return new FoodSummaryResponse
        {
            Period = period,
            DateRange = new DateRange { StartDate = startDate, EndDate = endDate },
            Summary = summary,
            Entries = entries.Select(MapToResponse).ToList()
        };
    }

    private static NutritionalSummary CalculateNutritionalSummary(List<FoodEntry> entries)
    {
        var summary = new NutritionalSummary { EntryCount = entries.Count };

        foreach (var entry in entries)
        {
            if (string.IsNullOrEmpty(entry.NutritionalData))
                continue;

            try
            {
                var nutritionalData = JsonDocument.Parse(entry.NutritionalData).RootElement;
                summary.TotalCalories += nutritionalData.TryGetProperty("calories", out var c) ? c.GetDecimal() : 0;
                summary.TotalProtein += nutritionalData.TryGetProperty("protein", out var p) ? p.GetDecimal() : 0;
                summary.TotalCarbs += nutritionalData.TryGetProperty("carbs", out var carbs) ? carbs.GetDecimal() : 0;
                summary.TotalFat += nutritionalData.TryGetProperty("fat", out var fat) ? fat.GetDecimal() : 0;
                summary.TotalFiber += nutritionalData.TryGetProperty("fiber", out var fiber) ? fiber.GetDecimal() : 0;
                summary.TotalSugar += nutritionalData.TryGetProperty("sugar", out var sugar) ? sugar.GetDecimal() : 0;
                summary.TotalSodium += nutritionalData.TryGetProperty("sodium", out var sodium) ? sodium.GetDecimal() : 0;
            }
            catch
            {
                // Skip invalid JSON
            }
        }

        return summary;
    }

    private static FoodEntryResponse MapToResponse(FoodEntry entry)
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
}

