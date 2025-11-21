using FluentValidation;
using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

        RuleFor(x => x.FirstName)
            .MaximumLength(255).WithMessage("First name must not exceed 255 characters");

        RuleFor(x => x.LastName)
            .MaximumLength(255).WithMessage("Last name must not exceed 255 characters");
    }
}

