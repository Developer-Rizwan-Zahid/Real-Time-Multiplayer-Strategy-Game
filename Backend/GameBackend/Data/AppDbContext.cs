using GameBackend.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    //Tables
    public DbSet<User> Users { get; set; }
    public DbSet<GameRoom> GameRooms { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameMove> GameMoves { get; set; }
    public DbSet<GameRule> GameRules { get; set; }
    public DbSet<GameLevel> GameLevels { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();

        modelBuilder.Entity<User>()
        .Property(u => u.Username)
        .IsRequired()
        .HasMaxLength(50);

        modelBuilder.Entity<User>()
        .Property(u => u.Email)
        .IsRequired()
        .HasMaxLength(100);
    }
}