using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMoodTracker.Core.Models;

[Table("food_database")]
public class FoodDatabase
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Column("brand")]
    [MaxLength(255)]
    public string? Brand { get; set; }

    [Column("category")]
    [MaxLength(255)]
    public string? Category { get; set; }

    [Column("serving_size", TypeName = "decimal(10,2)")]
    public decimal? ServingSize { get; set; }

    [Column("serving_unit")]
    [MaxLength(50)]
    public string? ServingUnit { get; set; }

    [Column("calories_per_serving", TypeName = "decimal(10,2)")]
    public decimal? CaloriesPerServing { get; set; }

    [Column("protein_per_serving", TypeName = "decimal(10,2)")]
    public decimal? ProteinPerServing { get; set; }

    [Column("carbs_per_serving", TypeName = "decimal(10,2)")]
    public decimal? CarbsPerServing { get; set; }

    [Column("fat_per_serving", TypeName = "decimal(10,2)")]
    public decimal? FatPerServing { get; set; }

    [Column("fiber_per_serving", TypeName = "decimal(10,2)")]
    public decimal? FiberPerServing { get; set; }

    [Column("sugar_per_serving", TypeName = "decimal(10,2)")]
    public decimal? SugarPerServing { get; set; }

    [Column("sodium_per_serving", TypeName = "decimal(10,2)")]
    public decimal? SodiumPerServing { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}

