public class GameRoom
{
    public int Id { get; set; }
    public string RoomName { get; set; }
    public int HostPlayerId { get; set; }
    public int? GuestPlayerId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}