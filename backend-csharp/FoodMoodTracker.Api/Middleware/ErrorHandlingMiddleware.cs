using System.Net;
using System.Text.Json;
using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public ErrorHandlingMiddleware(
        RequestDelegate next,
        ILogger<ErrorHandlingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var response = context.Response;

        var errorResponse = ApiResponse<object>.ErrorResponse("Internal server error");

        switch (exception)
        {
            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                errorResponse = ApiResponse<object>.ErrorResponse("Unauthorized");
                break;
            case ArgumentException:
            case InvalidOperationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorResponse = ApiResponse<object>.ErrorResponse(exception.Message);
                break;
            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                errorResponse = ApiResponse<object>.ErrorResponse("Resource not found");
                break;
            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                if (_environment.IsDevelopment())
                {
                    errorResponse.Error = exception.Message;
                }
                break;
        }

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(errorResponse, jsonOptions);
        await response.WriteAsync(json);
    }
}

