using FluentValidation;
using FoodMoodTracker.Core.DTOs;

namespace FoodMoodTracker.Core.Validators;

public class MoodEntryRequestValidator : AbstractValidator<MoodEntryRequest>
{
    public MoodEntryRequestValidator()
    {
        RuleFor(x => x.MoodRating)
            .InclusiveBetween(1, 10)
            .WithMessage("Mood rating must be between 1 and 10");

        RuleFor(x => x.Intensity)
            .InclusiveBetween(0, 1).When(x => x.Intensity.HasValue)
            .WithMessage("Intensity must be between 0 and 1");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).When(x => x.DurationMinutes.HasValue)
            .WithMessage("Duration must be positive");

        RuleFor(x => x.StartedAt)
            .NotEmpty().WithMessage("Started at date is required");
    }
}

