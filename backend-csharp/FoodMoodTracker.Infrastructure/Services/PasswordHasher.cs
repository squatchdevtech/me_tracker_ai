using FoodMoodTracker.Core.Services;
using BCrypt.Net;

namespace FoodMoodTracker.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltRounds = 12;

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, SaltRounds);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}

