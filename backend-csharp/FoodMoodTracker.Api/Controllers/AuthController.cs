using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodMoodTracker.Core.DTOs;
using FoodMoodTracker.Core.Services;
using System.Security.Claims;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);

            if (result == null)
            {
                return BadRequest(ApiResponse<AuthResponse>.ErrorResponse("User already exists with this email"));
            }

            return CreatedAtAction(nameof(GetProfile), ApiResponse<AuthResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration error");
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse("Invalid credentials"));
            }

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error");
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("Invalid token"));
            }

            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));
            }

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Get profile error");
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error"));
        }
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(ApiResponse<UserResponse>.ErrorResponse("Invalid token"));
            }

            var user = await _authService.UpdateUserAsync(userId, request);

            if (user == null)
            {
                return NotFound(ApiResponse<UserResponse>.ErrorResponse("User not found"));
            }

            return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Update profile error");
            return StatusCode(500, ApiResponse<UserResponse>.ErrorResponse("Internal server error"));
        }
    }
}

