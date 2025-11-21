using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Models;
using FoodMoodTracker.Core.Services;
using FoodMoodTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FoodMoodTracker.Infrastructure.Services;

public class MoodEntryService : IMoodEntryService
{
    private readonly ApplicationDbContext _context;

    public MoodEntryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<MoodEntryResponse>> GetEntriesAsync(int userId, int page, int limit)
    {
        var skip = (page - 1) * limit;

        var query = _context.MoodEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.StartedAt);

        var total = await query.CountAsync();
        var entries = await query
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        return new PagedResponse<MoodEntryResponse>
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

    public async Task<MoodEntryResponse?> GetEntryByIdAsync(int id, int userId)
    {
        var entry = await _context.MoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        return entry != null ? MapToResponse(entry) : null;
    }

    public async Task<MoodEntryResponse> CreateEntryAsync(int userId, MoodEntryRequest request)
    {
        var entry = new MoodEntry
        {
            UserId = userId,
            MoodRating = request.MoodRating,
            MoodType = request.MoodType,
            Intensity = request.Intensity,
            DurationMinutes = request.DurationMinutes,
            StartedAt = request.StartedAt,
            EndedAt = request.EndedAt,
            Notes = request.Notes,
            Triggers = request.Triggers,
            CreatedAt = DateTime.UtcNow
        };

        _context.MoodEntries.Add(entry);
        await _context.SaveChangesAsync();

        return MapToResponse(entry);
    }

    public async Task<MoodEntryResponse?> UpdateEntryAsync(int id, int userId, MoodEntryRequest request)
    {
        var entry = await _context.MoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return null;
        }

        entry.MoodRating = request.MoodRating;
        entry.MoodType = request.MoodType;
        entry.Intensity = request.Intensity;
        entry.DurationMinutes = request.DurationMinutes;
        entry.StartedAt = request.StartedAt;
        entry.EndedAt = request.EndedAt;
        entry.Notes = request.Notes;
        entry.Triggers = request.Triggers;

        await _context.SaveChangesAsync();

        return MapToResponse(entry);
    }

    public async Task<bool> DeleteEntryAsync(int id, int userId)
    {
        var entry = await _context.MoodEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (entry == null)
        {
            return false;
        }

        _context.MoodEntries.Remove(entry);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<MoodSummaryResponse> GetSummaryAsync(int userId, DateTime? startDate, DateTime? endDate)
    {
        var query = _context.MoodEntries.Where(e => e.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(e => e.StartedAt >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(e => e.StartedAt <= endDate.Value);

        var entries = await query.OrderBy(e => e.StartedAt).ToListAsync();

        if (entries.Count == 0)
        {
            return new MoodSummaryResponse
            {
                Period = new DateRange
                {
                    StartDate = startDate ?? DateTime.UtcNow.AddDays(-30),
                    EndDate = endDate ?? DateTime.UtcNow
                },
                AverageMood = 0,
                MoodDistribution = new Dictionary<string, int>(),
                Trends = new MoodTrends()
            };
        }

        var averageMood = entries.Average(e => e.MoodRating);
        var moodDistribution = entries
            .GroupBy(e => e.MoodType.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var weeklyAverage = CalculateWeeklyAverage(entries);

        return new MoodSummaryResponse
        {
            Period = new DateRange
            {
                StartDate = startDate ?? entries.Min(e => e.StartedAt),
                EndDate = endDate ?? entries.Max(e => e.StartedAt)
            },
            AverageMood = Math.Round((decimal)averageMood, 2),
            MoodDistribution = moodDistribution,
            Trends = new MoodTrends
            {
                WeeklyAverage = weeklyAverage,
                DailyPatterns = new Dictionary<string, object>()
            }
        };
    }

    private static List<decimal> CalculateWeeklyAverage(List<MoodEntry> entries)
    {
        var weeklyAverages = new List<decimal>();
        var groupedByWeek = entries
            .GroupBy(e => GetWeekOfYear(e.StartedAt))
            .OrderBy(g => g.Key)
            .ToList();

        foreach (var week in groupedByWeek)
        {
            weeklyAverages.Add(Math.Round((decimal)week.Average(e => e.MoodRating), 2));
        }

        return weeklyAverages;
    }

    private static int GetWeekOfYear(DateTime date)
    {
        var calendar = System.Globalization.CultureInfo.CurrentCulture.Calendar;
        return calendar.GetWeekOfYear(date, System.Globalization.CalendarWeekRule.FirstDay, DayOfWeek.Sunday);
    }

    private static MoodEntryResponse MapToResponse(MoodEntry entry)
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
}

