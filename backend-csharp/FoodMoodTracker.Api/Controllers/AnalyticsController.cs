using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;
using System.Text;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    [HttpGet("correlations")]
    public async Task<ActionResult<ApiResponse<CorrelationsResponse>>> GetCorrelations(
        [FromQuery] int days = 30)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<CorrelationsResponse>.ErrorResponse("Invalid token"));

            var result = await _analyticsService.GetCorrelationsAsync(userId.Value, days);
            return Ok(ApiResponse<CorrelationsResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get correlations error");
            return StatusCode(500, ApiResponse<CorrelationsResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("trends")]
    public async Task<ActionResult<ApiResponse<TrendsResponse>>> GetTrends(
        [FromQuery] string period = "monthly",
        [FromQuery] int months = 6)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<TrendsResponse>.ErrorResponse("Invalid token"));

            var result = await _analyticsService.GetTrendsAsync(userId.Value, period, months);
            return Ok(ApiResponse<TrendsResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get trends error");
            return StatusCode(500, ApiResponse<TrendsResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("insights")]
    public async Task<ActionResult<ApiResponse<InsightsResponse>>> GetInsights(
        [FromQuery] int days = 30)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<InsightsResponse>.ErrorResponse("Invalid token"));

            var result = await _analyticsService.GetInsightsAsync(userId.Value, days);
            return Ok(ApiResponse<InsightsResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get insights error");
            return StatusCode(500, ApiResponse<InsightsResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export(
        [FromQuery] string format = "json",
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid token"));

            var exportData = await _analyticsService.ExportDataAsync(userId.Value, startDate, endDate);

            if (format.ToLower() == "csv")
            {
                var csv = ConvertToCsv(exportData);
                var bytes = Encoding.UTF8.GetBytes(csv);
                return File(bytes, "text/csv", "food-mood-data.csv");
            }
            else
            {
                var json = System.Text.Json.JsonSerializer.Serialize(exportData, new System.Text.Json.JsonSerializerOptions
                {
                    WriteIndented = true
                });
                var bytes = Encoding.UTF8.GetBytes(json);
                return File(bytes, "application/json", "food-mood-data.json");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Export data error");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error"));
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out int userId) ? userId : null;
    }

    private static string ConvertToCsv(ExportResponse data)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Date,Type,Name,Value,Notes");

        foreach (var entry in data.FoodEntries)
        {
            sb.AppendLine($"{entry.ConsumedAt:yyyy-MM-dd},Food,\"{entry.FoodName}\",{entry.Quantity ?? 0},\"{entry.Notes ?? ""}\"");
        }

        foreach (var entry in data.MoodEntries)
        {
            sb.AppendLine($"{entry.StartedAt:yyyy-MM-dd},Mood,\"{entry.MoodType}\",{entry.MoodRating},\"{entry.Notes ?? ""}\"");
        }

        return sb.ToString();
    }
}

