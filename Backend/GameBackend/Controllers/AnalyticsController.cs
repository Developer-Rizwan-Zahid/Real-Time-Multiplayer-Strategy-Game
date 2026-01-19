using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Security.Claims;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AnalyticsController(AppDbContext context, IHttpClientFactory factory, IConfiguration configuration)
    {
        _context = context;
        _httpClient = factory.CreateClient();
        _configuration = configuration;
    }

    //Player Performance Stats
    [HttpGet("player")]
    public async Task<IActionResult> GetPlayerAnalytics()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var games = await _context.Games
            .Where(g => g.IsFinished &&
                (g.Player1Id == playerId || g.Player2Id == playerId))
            .ToListAsync();

        int wins = 0, losses = 0, draws = 0;

        foreach (var g in games)
        {
            if (g.Player1Score == g.Player2Score)
                draws++;
            else if (
                (g.Player1Id == playerId && g.Player1Score > g.Player2Score) ||
                (g.Player2Id == playerId && g.Player2Score > g.Player1Score)
            )
                wins++;
            else
                losses++;
        }

        var user = await _context.Users.FindAsync(playerId);

        var response = new PlayerAnalyticsResponse
        {
            MatchesPlayed = games.Count,
            Wins = wins,
            Losses = losses,
            Draws = draws,
            SkillRating = user.SkillRating,
            WinRate = games.Count == 0 ? 0 : Math.Round((double)wins / games.Count * 100, 2)
        };

        return Ok(response);
    }

    //AI Insights (from Python service)
    [HttpGet("ai-insights")]
    public async Task<IActionResult> GetAIInsights()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var data = await _context.Games
            .Where(g => g.Player1Id == playerId || g.Player2Id == playerId)
            .Select(g => new
            {
                g.Id,
                g.Player1Id,
                g.Player2Id,
                g.Player1Score,
                g.Player2Score,
                g.IsFinished,
                g.StartedAt,
                g.FinishedAt
            })
            .ToListAsync();

        var response = await _httpClient.PostAsJsonAsync(
            _configuration["AiServiceUrl"] + "/analyze",
            new { playerId, games = data }
        );

        var aiResult = await response.Content.ReadAsStringAsync();
        return Ok(aiResult);
    }

}
