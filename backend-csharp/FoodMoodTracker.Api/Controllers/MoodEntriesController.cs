using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("api/mood-entries")]
[Authorize]
public class MoodEntriesController : ControllerBase
{
    private readonly IMoodEntryService _moodEntryService;
    private readonly ILogger<MoodEntriesController> _logger;

    public MoodEntriesController(IMoodEntryService moodEntryService, ILogger<MoodEntriesController> logger)
    {
        _moodEntryService = moodEntryService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<MoodEntryResponse>>>> GetEntries(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<PagedResponse<MoodEntryResponse>>.ErrorResponse("Invalid token"));

            var result = await _moodEntryService.GetEntriesAsync(userId.Value, page, limit);
            return Ok(ApiResponse<PagedResponse<MoodEntryResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get mood entries error");
            return StatusCode(500, ApiResponse<PagedResponse<MoodEntryResponse>>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<MoodEntryResponse>>> GetEntry(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<MoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _moodEntryService.GetEntryByIdAsync(id, userId.Value);

            if (entry == null)
            {
                return NotFound(ApiResponse<MoodEntryResponse>.ErrorResponse("Mood entry not found"));
            }

            return Ok(ApiResponse<MoodEntryResponse>.SuccessResponse(entry));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get mood entry error");
            return StatusCode(500, ApiResponse<MoodEntryResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<MoodEntryResponse>>> CreateEntry([FromBody] MoodEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<MoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _moodEntryService.CreateEntryAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, ApiResponse<MoodEntryResponse>.SuccessResponse(entry, null));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Create mood entry error");
            return StatusCode(500, ApiResponse<MoodEntryResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<MoodEntryResponse>>> UpdateEntry(int id, [FromBody] MoodEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<MoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _moodEntryService.UpdateEntryAsync(id, userId.Value, request);

            if (entry == null)
            {
                return NotFound(ApiResponse<MoodEntryResponse>.ErrorResponse("Mood entry not found"));
            }

            return Ok(ApiResponse<MoodEntryResponse>.SuccessResponse(entry));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Update mood entry error");
            return StatusCode(500, ApiResponse<MoodEntryResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteEntry(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid token"));

            var deleted = await _moodEntryService.DeleteEntryAsync(id, userId.Value);

            if (!deleted)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Mood entry not found"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Mood entry deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Delete mood entry error");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<MoodSummaryResponse>>> GetSummary(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<MoodSummaryResponse>.ErrorResponse("Invalid token"));

            var summary = await _moodEntryService.GetSummaryAsync(userId.Value, startDate, endDate);
            return Ok(ApiResponse<MoodSummaryResponse>.SuccessResponse(summary));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get mood summary error");
            return StatusCode(500, ApiResponse<MoodSummaryResponse>.ErrorResponse("Internal server error"));
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out int userId) ? userId : null;
    }
}

