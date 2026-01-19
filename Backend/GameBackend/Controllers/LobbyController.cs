using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/lobby")]
[Authorize]
public class LobbyController : ControllerBase
{
    private readonly AppDbContext _context;

    public LobbyController(AppDbContext context)
    {
        _context = context;
    }

    //Create Game Room
    [HttpPost("create")]
    public async Task<IActionResult> CreateRoom(CreateRoomRequest request)
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var room = new GameRoom
        {
            RoomName = request.RoomName,
            HostPlayerId = playerId
        };

        _context.GameRooms.Add(room);
        await _context.SaveChangesAsync();

        return Ok(room);
    }

    //Join Game Room
    [HttpPost("join/{roomId}")]
    public async Task<IActionResult> JoinRoom(int roomId)
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var room = await _context.GameRooms.FindAsync(roomId);
        if (room == null || !room.IsActive)
            return NotFound("Room not found");

        if (room.GuestPlayerId != null)
            return BadRequest("Room already full");

        if (room.HostPlayerId == playerId)
            return BadRequest("Host cannot join own room");

        room.GuestPlayerId = playerId;
        await _context.SaveChangesAsync();

        return Ok("Joined room successfully");
    }

    //Leave Game Room
    [HttpPost("leave/{roomId}")]
    public async Task<IActionResult> LeaveRoom(int roomId)
    {
        var playerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var room = await _context.GameRooms.FindAsync(roomId);
        if (room == null)
            return NotFound("Room not found");

        if (room.HostPlayerId == playerId)
        {
            room.IsActive = false; 
        }
        else if (room.GuestPlayerId == playerId)
        {
            room.GuestPlayerId = null;
        }
        else
        {
            return BadRequest("You are not part of this room");
        }

        await _context.SaveChangesAsync();
        return Ok("Left room successfully");
    }

    //List Available Rooms
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableRooms()
    {
        var rooms = await _context.GameRooms
            .Where(r => r.IsActive && r.GuestPlayerId == null)
            .Select(r => new
            {
                r.Id,
                r.RoomName,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(rooms);
    }

    // Get Room Details
    [HttpGet("{roomId}")]
    public async Task<IActionResult> GetRoom(int roomId)
    {
        var room = await _context.GameRooms.FindAsync(roomId);
        if (room == null) return NotFound();
        return Ok(room);
    }
}
