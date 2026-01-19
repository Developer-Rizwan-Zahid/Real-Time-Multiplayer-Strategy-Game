using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/player")]
[Authorize]
public class PlayerController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlayerController(AppDbContext context)
    {
        _context = context;
    }

    //Get Player Profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.SkillRating,
                u.MatchesPlayed,
                u.MatchesWon
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("Player not found");

        return Ok(user);
    }

    //Update Player Info
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] string username)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Player not found");

        user.Username = username;
        await _context.SaveChangesAsync();

        return Ok("Profile updated successfully");
    }

    //Player Stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Player not found");

        var stats = new PlayerStatsDto
        {
            MatchesPlayed = user.MatchesPlayed,
            MatchesWon = user.MatchesWon,
            SkillRating = user.SkillRating,
            WinRate = user.MatchesPlayed == 0
                ? 0
                : Math.Round((double)user.MatchesWon / user.MatchesPlayed * 100, 2)
        };

        return Ok(stats);
    }
}
