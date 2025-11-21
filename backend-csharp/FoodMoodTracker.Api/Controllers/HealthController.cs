using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FoodMoodTracker.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "OK",
            timestamp = DateTime.UtcNow.ToString("O"),
            uptime = Process.GetCurrentProcess().StartTime
        });
    }
}

