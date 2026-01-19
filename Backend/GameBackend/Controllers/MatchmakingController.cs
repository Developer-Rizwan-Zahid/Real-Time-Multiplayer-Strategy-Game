using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Security.Claims;

[ApiController]
[Route("api/matchmaking")]
[Authorize]
public class MatchmakingController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;

    public MatchmakingController(AppDbContext context, IHttpClientFactory factory)
    {
        _context = context;
        _httpClient = factory.CreateClient();
    }

    //Skill-Based Matchmaking
    [HttpPost("find")]
    public async Task<IActionResult> FindMatch()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var player = await _context.Users.FindAsync(playerId);
        if (player == null)
            return NotFound("Player not found");

        var request = new MatchmakingRequest
        {
            PlayerId = player.Id,
            SkillRating = player.SkillRating
        };

        //Call Python AI Service
        var response = await _httpClient.PostAsJsonAsync(
            "http://ai-service:8000/matchmake", request
        );

        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "AI matchmaking failed");

        var result = await response.Content.ReadFromJsonAsync<MatchmakingResult>();

        return Ok(result);
    }

    //AI Opponent Recommendation
    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var player = await _context.Users.FindAsync(playerId);
        if (player == null)
            return NotFound();

        var players = await _context.Users
            .Where(u => u.Id != playerId)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.SkillRating
            })
            .ToListAsync();

        return Ok(players);
    }
}
