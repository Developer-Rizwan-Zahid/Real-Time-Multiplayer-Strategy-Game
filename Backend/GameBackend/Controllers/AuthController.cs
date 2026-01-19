using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<User>();
    }

    //Signup
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("User already exists");

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            Role = string.IsNullOrEmpty(request.Role) ? "Player" : 
                   (request.Role.ToLower() == "admin" ? "Admin" : "Player")
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("User registered successfully");
    }

    //Login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return Unauthorized("Invalid credentials");

        var result = _passwordHasher.VerifyHashedPassword(
            user, user.PasswordHash, request.Password
        );

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials");

        var token = _jwtService.GenerateToken(user);

        // Force Admin for the test user
        var userRole = user.Role;
        if (user.Email.ToLower() == "subhan@gmail.com") userRole = "Admin";

        return Ok(new
        {
            token,
            user.Id,
            user.Username,
            Role = userRole
        });
    }

    //Refresh Token (Basic Version)
    [HttpPost("refresh")]
    public IActionResult RefreshToken()
    {
        return Ok("Refresh token logic can be implemented here");
    }

    // DEBUG ONLY: Promote user to Admin (Used to fix existing accounts)
    [HttpPost("promote-admin")]
    public async Task<IActionResult> PromoteAdmin([FromBody] string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null) return NotFound("User not found");

        user.Role = "Admin";
        await _context.SaveChangesAsync();
        return Ok($"User {email} promoted to Admin successfully");
    }
}
