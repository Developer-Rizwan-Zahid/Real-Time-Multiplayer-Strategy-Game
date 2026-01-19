public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    
    //Game Status
    public int MatchesPlayed { get; set; } = 0;
    public int MatchesWon { get; set; } = 0;
    public int SkillRating { get; set; } = 1000;
    public string Role { get; set; } = "Player";
    public bool IsBanned { get; set; } = false;


}
