using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Services;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<UserResponse?> GetUserByIdAsync(int userId);
    Task<UserResponse?> UpdateUserAsync(int userId, UpdateProfileRequest request);
}

