using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMoodTracker.Core.Models;

[Table("mood_entries")]
public class MoodEntry
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("user_id")]
    public int UserId { get; set; }

    [Required]
    [Column("mood_rating")]
    public int MoodRating { get; set; }

    [Required]
    [Column("mood_type")]
    public MoodType MoodType { get; set; }

    [Column("intensity", TypeName = "decimal(3,2)")]
    public decimal? Intensity { get; set; }

    [Column("duration_minutes")]
    public int? DurationMinutes { get; set; }

    [Required]
    [Column("started_at")]
    public DateTime StartedAt { get; set; }

    [Column("ended_at")]
    public DateTime? EndedAt { get; set; }

    [Column("notes", TypeName = "text")]
    public string? Notes { get; set; }

    [Column("triggers", TypeName = "text")]
    public string? Triggers { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}

