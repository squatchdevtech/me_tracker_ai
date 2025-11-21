using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMoodTracker.Core.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("email")]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("password_hash")]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("first_name")]
    [MaxLength(255)]
    public string? FirstName { get; set; }

    [Column("last_name")]
    [MaxLength(255)]
    public string? LastName { get; set; }

    [Column("date_of_birth")]
    public DateTime? DateOfBirth { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<FoodEntry> FoodEntries { get; set; } = new List<FoodEntry>();
    public virtual ICollection<MoodEntry> MoodEntries { get; set; } = new List<MoodEntry>();
}

