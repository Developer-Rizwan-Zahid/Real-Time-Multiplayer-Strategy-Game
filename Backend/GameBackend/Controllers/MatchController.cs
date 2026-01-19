using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/matches")]
[Authorize]
public class MatchController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatchController(AppDbContext context)
    {
        _context = context;
    }

    //Match History (All matches of logged-in player)
    [HttpGet("history")]
    public async Task<IActionResult> GetMatchHistory()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var matches = await _context.Games
            .Where(g => g.Player1Id == playerId || g.Player2Id == playerId)
            .OrderByDescending(g => g.StartedAt)
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

        return Ok(matches);
    }

    //Ongoing Matches
    [HttpGet("ongoing")]
    public async Task<IActionResult> GetOngoingMatches()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var matches = await _context.Games
            .Where(g =>
                !g.IsFinished &&
                (g.Player1Id == playerId || g.Player2Id == playerId)
            )
            .Select(g => new
            {
                g.Id,
                g.Player1Id,
                g.Player2Id,
                g.Player1Score,
                g.Player2Score,
                g.StartedAt
            })
            .ToListAsync();

        return Ok(matches);
    }

    //Completed Matches
    [HttpGet("completed")]
    public async Task<IActionResult> GetCompletedMatches()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var matches = await _context.Games
            .Where(g =>
                g.IsFinished &&
                (g.Player1Id == playerId || g.Player2Id == playerId)
            )
            .Select(g => new
            {
                g.Id,
                g.Player1Id,
                g.Player2Id,
                g.Player1Score,
                g.Player2Score,
                g.FinishedAt,
                Result =
                    g.Player1Score == g.Player2Score
                        ? "Draw"
                        : (g.Player1Id == playerId && g.Player1Score > g.Player2Score) ||
                          (g.Player2Id == playerId && g.Player2Score > g.Player1Score)
                            ? "Win"
                            : "Loss"
            })
            .ToListAsync();

        return Ok(matches);
    }

    //Match Result
    [HttpGet("{matchId}/result")]
    public async Task<IActionResult> GetMatchResult(int matchId)
    {
        var match = await _context.Games.FindAsync(matchId);
        if (match == null)
            return NotFound("Match not found");

        string result;
        if (match.Player1Score == match.Player2Score)
            result = "Draw";
        else
            result = match.Player1Score > match.Player2Score
                ? "Player 1 Won"
                : "Player 2 Won";

        return Ok(new
        {
            match.Id,
            match.Player1Score,
            match.Player2Score,
            result,
            match.StartedAt,
            match.FinishedAt
        });
    }
}
