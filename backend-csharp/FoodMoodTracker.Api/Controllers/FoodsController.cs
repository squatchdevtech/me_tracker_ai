using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("api/foods")]
[Authorize]
public class FoodsController : ControllerBase
{
    private readonly IFoodDatabaseService _foodDatabaseService;
    private readonly ILogger<FoodsController> _logger;

    public FoodsController(IFoodDatabaseService foodDatabaseService, ILogger<FoodsController> logger)
    {
        _foodDatabaseService = foodDatabaseService;
        _logger = logger;
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<FoodSearchResponse>>> SearchFoods(
        [FromQuery] string q,
        [FromQuery] int limit = 10)
    {
        try
        {
            if (string.IsNullOrEmpty(q) || q.Length < 2)
            {
                return BadRequest(ApiResponse<FoodSearchResponse>.ErrorResponse(
                    "Query parameter 'q' is required and must be at least 2 characters long"));
            }

            var result = await _foodDatabaseService.SearchFoodsAsync(q, limit);
            return Ok(ApiResponse<FoodSearchResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Search food database error");
            return StatusCode(500, ApiResponse<FoodSearchResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("database/{id}")]
    public async Task<ActionResult<ApiResponse<FoodDatabaseResponse>>> GetFood(int id)
    {
        try
        {
            var food = await _foodDatabaseService.GetFoodByIdAsync(id);

            if (food == null)
            {
                return NotFound(ApiResponse<FoodDatabaseResponse>.ErrorResponse("Food not found in database"));
            }

            return Ok(ApiResponse<FoodDatabaseResponse>.SuccessResponse(food));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get food from database error");
            return StatusCode(500, ApiResponse<FoodDatabaseResponse>.ErrorResponse("Internal server error"));
        }
    }
}

