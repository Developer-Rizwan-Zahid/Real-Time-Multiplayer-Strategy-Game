using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;   
using GameBackend.Models;   

namespace GameBackend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // Get All Players
        [HttpGet("players")]
        public async Task<IActionResult> GetPlayers()
        {
            var players = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.SkillRating,
                    u.IsBanned,
                    u.Role
                })
                .ToListAsync();

            return Ok(players);
        }

        // Ban Player
        [HttpPost("players/{id}/ban")]
        public async Task<IActionResult> BanPlayer(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.IsBanned = true;
            await _context.SaveChangesAsync();

            return Ok("Player banned");
        }

        // Unban Player
        [HttpPost("players/{id}/unban")]
        public async Task<IActionResult> UnbanPlayer(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.IsBanned = false;
            await _context.SaveChangesAsync();

            return Ok("Player unbanned");
        }

        // Game Rules
        [HttpGet("rules")]
        public async Task<IActionResult> GetRules()
        {
            return Ok(await _context.GameRules.ToListAsync());
        }

        [HttpPost("rules")]
        public async Task<IActionResult> SaveRule(GameRule rule)
        {
            var existing = await _context.GameRules
                .FirstOrDefaultAsync(r => r.Name == rule.Name);

            if (existing == null)
                _context.GameRules.Add(rule);
            else
                existing.Value = rule.Value;

            await _context.SaveChangesAsync();
            return Ok("Rule saved");
        }

        // Levels
        [HttpGet("levels")]
        public async Task<IActionResult> GetLevels()
        {
            return Ok(await _context.GameLevels.ToListAsync());
        }

        [HttpPost("levels")]
        public async Task<IActionResult> AddLevel(GameLevel level)
        {
            _context.GameLevels.Add(level);
            await _context.SaveChangesAsync();
            return Ok("Level added");
        }
    }
}
