using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMoodTracker.Core.Models;

[Table("food_entries")]
public class FoodEntry
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("user_id")]
    public int UserId { get; set; }

    [Required]
    [Column("food_name")]
    [MaxLength(255)]
    public string FoodName { get; set; } = string.Empty;

    [Column("quantity", TypeName = "decimal(10,2)")]
    public decimal? Quantity { get; set; }

    [Column("unit")]
    [MaxLength(50)]
    public string? Unit { get; set; }

    [Column("nutritional_data", TypeName = "json")]
    public string? NutritionalData { get; set; }

    [Required]
    [Column("consumed_at")]
    public DateTime ConsumedAt { get; set; }

    [Column("notes", TypeName = "text")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}

