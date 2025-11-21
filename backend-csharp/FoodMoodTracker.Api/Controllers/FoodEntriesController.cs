using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;
using System.Security.Claims;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("api/food-entries")]
[Authorize]
public class FoodEntriesController : ControllerBase
{
    private readonly IFoodEntryService _foodEntryService;
    private readonly ILogger<FoodEntriesController> _logger;

    public FoodEntriesController(IFoodEntryService foodEntryService, ILogger<FoodEntriesController> logger)
    {
        _foodEntryService = foodEntryService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<FoodEntryResponse>>>> GetEntries(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<PagedResponse<FoodEntryResponse>>.ErrorResponse("Invalid token"));

            var result = await _foodEntryService.GetEntriesAsync(userId.Value, page, limit);
            return Ok(ApiResponse<PagedResponse<FoodEntryResponse>>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get food entries error");
            return StatusCode(500, ApiResponse<PagedResponse<FoodEntryResponse>>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<FoodEntryResponse>>> GetEntry(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<FoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _foodEntryService.GetEntryByIdAsync(id, userId.Value);

            if (entry == null)
            {
                return NotFound(ApiResponse<FoodEntryResponse>.ErrorResponse("Food entry not found"));
            }

            return Ok(ApiResponse<FoodEntryResponse>.SuccessResponse(entry));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get food entry error");
            return StatusCode(500, ApiResponse<FoodEntryResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<FoodEntryResponse>>> CreateEntry([FromBody] FoodEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<FoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _foodEntryService.CreateEntryAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, ApiResponse<FoodEntryResponse>.SuccessResponse(entry, null));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Create food entry error");
            return StatusCode(500, ApiResponse<FoodEntryResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<FoodEntryResponse>>> UpdateEntry(int id, [FromBody] FoodEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<FoodEntryResponse>.ErrorResponse("Invalid token"));

            var entry = await _foodEntryService.UpdateEntryAsync(id, userId.Value, request);

            if (entry == null)
            {
                return NotFound(ApiResponse<FoodEntryResponse>.ErrorResponse("Food entry not found"));
            }

            return Ok(ApiResponse<FoodEntryResponse>.SuccessResponse(entry));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Update food entry error");
            return StatusCode(500, ApiResponse<FoodEntryResponse>.ErrorResponse("Internal server error"));
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

            var deleted = await _foodEntryService.DeleteEntryAsync(id, userId.Value);

            if (!deleted)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Food entry not found"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null, "Food entry deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Delete food entry error");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<FoodSummaryResponse>>> GetSummary(
        [FromQuery] string period = "daily",
        [FromQuery] DateTime? date = null)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<FoodSummaryResponse>.ErrorResponse("Invalid token"));

            var summary = await _foodEntryService.GetSummaryAsync(userId.Value, period, date);
            return Ok(ApiResponse<FoodSummaryResponse>.SuccessResponse(summary));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<FoodSummaryResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get food summary error");
            return StatusCode(500, ApiResponse<FoodSummaryResponse>.ErrorResponse("Internal server error"));
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        return int.TryParse(userIdClaim, out int userId) ? userId : null;
    }
}

