public class GameMove
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public int PlayerId { get; set; }
    public string MoveData { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}