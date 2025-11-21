using FluentValidation;
using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Validators;

public class FoodEntryRequestValidator : AbstractValidator<FoodEntryRequest>
{
    public FoodEntryRequestValidator()
    {
        RuleFor(x => x.FoodName)
            .NotEmpty().WithMessage("Food name is required")
            .MaximumLength(255).WithMessage("Food name must not exceed 255 characters");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).When(x => x.Quantity.HasValue)
            .WithMessage("Quantity must be positive");

        RuleFor(x => x.ConsumedAt)
            .NotEmpty().WithMessage("Consumed at date is required");
    }
}

