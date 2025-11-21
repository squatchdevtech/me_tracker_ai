using FoodMoodTracker.Core.Models;

namespace FoodMoodTracker.Core.Services;

public interface IJwtService
{
    string GenerateToken(User user);
    int? ValidateToken(string token);
}

