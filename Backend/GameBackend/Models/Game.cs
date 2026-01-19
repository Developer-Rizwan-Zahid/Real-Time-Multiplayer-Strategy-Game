public class Game
{
    public int Id { get; set; }
    public int Player1Id { get; set; }
    public int Player2Id { get; set; }
    public int CurrentTurnPlayerId { get; set; }
    public int Player1Score { get; set; } = 0;
    public int Player2Score { get; set; } = 0;
    public bool IsFinished { get; set; } = false;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? FinishedAt { get; set; } 
}