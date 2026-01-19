using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/game")]
[Authorize]
public class GameController : ControllerBase
{
    private readonly AppDbContext _context;

    public GameController(AppDbContext context)
    {
        _context = context;
    }

    //Start Game 
    [HttpPost("start")]
    public async Task<IActionResult> StartGame(StartGameRequest request)
    {
        var room = await _context.GameRooms.FindAsync(request.RoomId);
        if (room == null || room.GuestPlayerId == null)
            return BadRequest("Room not ready");

        var game = new Game
        {
            Player1Id = room.HostPlayerId,
            Player2Id = room.GuestPlayerId.Value,
            CurrentTurnPlayerId = room.HostPlayerId
        };

        _context.Games.Add(game);

        room.IsActive = false; 
        await _context.SaveChangesAsync();

        return Ok(game);
    }

    //Make Move
    [HttpPost("move")]
    public async Task<IActionResult> MakeMove(MakeMoveRequest request)
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var game = await _context.Games.FindAsync(request.GameId);
        if (game == null || game.IsFinished)
            return BadRequest("Invalid game");

        if (game.CurrentTurnPlayerId != playerId)
            return BadRequest("Not your turn");

        // Save move
        var move = new GameMove
        {
            GameId = game.Id,
            PlayerId = playerId,
            MoveData = request.MoveData
        };

        _context.GameMoves.Add(move);

        // Fetch all moves for this game to check for win
        var allMoves = await _context.GameMoves
            .Where(m => m.GameId == game.Id)
            .ToListAsync();
        
        // Add the current move
        allMoves.Add(move);

        var grid = new int?[3, 3];
        foreach (var m in allMoves)
        {
            var options = new System.Text.Json.JsonDocumentOptions { AllowTrailingCommas = true };
            using var doc = System.Text.Json.JsonDocument.Parse(m.MoveData, options);
            var root = doc.RootElement;
            int x = root.GetProperty("x").GetInt32();
            int y = root.GetProperty("y").GetInt32();
            grid[x, y] = m.PlayerId;
        }

        bool won = CheckForWin(grid, playerId);
        bool draw = !won && allMoves.Count >= 9;

        if (won)
        {
            if (playerId == game.Player1Id)
                game.Player1Score += 100;
            else
                game.Player2Score += 100;
            
            game.IsFinished = true;
            game.FinishedAt = DateTime.UtcNow;
        }
        else if (draw)
        {
            game.IsFinished = true;
            game.FinishedAt = DateTime.UtcNow;
        }
        else
        {
            if (playerId == game.Player1Id)
                game.Player1Score += 10;
            else
                game.Player2Score += 10;

            game.CurrentTurnPlayerId =
                game.CurrentTurnPlayerId == game.Player1Id
                    ? game.Player2Id
                    : game.Player1Id;
        }

        await _context.SaveChangesAsync();

        return Ok(won ? "Win" : (draw ? "Draw" : "Move accepted"));
    }

    private bool CheckForWin(int?[,] grid, int pid)
    {
        // Rows
        for (int i = 0; i < 3; i++)
            if (grid[i, 0] == pid && grid[i, 1] == pid && grid[i, 2] == pid) return true;
        
        // Columns
        for (int i = 0; i < 3; i++)
            if (grid[0, i] == pid && grid[1, i] == pid && grid[2, i] == pid) return true;
        
        // Diagonals
        if (grid[0, 0] == pid && grid[1, 1] == pid && grid[2, 2] == pid) return true;
        if (grid[0, 2] == pid && grid[1, 1] == pid && grid[2, 0] == pid) return true;

        return false;
    }

    //Get Game State
    [HttpGet("{gameId}")]
    public async Task<IActionResult> GetGameState(int gameId)
    {
        var game = await _context.Games.FindAsync(gameId);
        if (game == null)
            return NotFound();

        var moves = await _context.GameMoves
            .Where(m => m.GameId == gameId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return Ok(new { Game = game, Moves = moves });
    }
    //End Game 
    [HttpPost("end/{gameId}")]
    public async Task<IActionResult> EndGame(int gameId)
    {
        var game = await _context.Games.FindAsync(gameId);
        if (game == null)
            return NotFound();

        game.IsFinished = true;
        game.FinishedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok("Game ended");
    }
    //Get Current Active Game for User (Used for redirection from lobby)
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentGame()
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var game = await _context.Games
            .Where(g => !g.IsFinished && (g.Player1Id == playerId || g.Player2Id == playerId))
            .OrderByDescending(g => g.StartedAt)
            .FirstOrDefaultAsync();

        if (game == null)
            return NotFound("No active game found");

        return Ok(game);
    }
}
