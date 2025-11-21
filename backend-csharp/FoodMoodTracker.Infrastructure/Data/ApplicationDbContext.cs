using Microsoft.EntityFrameworkCore;
using FoodMoodTracker.Core.Models;

namespace FoodMoodTracker.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<FoodEntry> FoodEntries { get; set; }
    public DbSet<MoodEntry> MoodEntries { get; set; }
    public DbSet<FoodDatabase> FoodDatabase { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        });

        // FoodEntry configuration
        modelBuilder.Entity<FoodEntry>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(u => u.FoodEntries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // MoodEntry configuration
        modelBuilder.Entity<MoodEntry>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(u => u.MoodEntries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // FoodDatabase configuration
        modelBuilder.Entity<FoodDatabase>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}

