using FASystemAPI.Data;
using FASystemAPI.Models.DTO;
using FASystemAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BCryptNet = BCrypt.Net.BCrypt;
using Microsoft.AspNetCore.Authorization;

namespace FASystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseAPIController
    {
        private readonly ITokensService _tokenService;  

        public UsersController(FADbContext dbContext, ITokensService tokensService) : base(dbContext) 
        { 
            _tokenService = tokensService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserReadDTO>>> GetAll()
        {
            var userList = await _dbContext.Users.ToListAsync();
            var userReadList = userList.Select(i => new UserReadDTO().FromModel(i)).ToList();

            return Ok(userReadList);
        }

        [HttpGet("Me"), Authorize]
        public async Task<ActionResult<UserReadDTO>> Me()
        {
            var user = await getCurrentUserAsync();

            return Ok(new UserReadDTO().FromModel(user));
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoggedInResponse>> Login(LoginRequest request)
        {
            var user = await _dbContext.Users.Include(i => i.RefreshTokens).FirstOrDefaultAsync(i => i.Login == request.Login);

            if (user is null || !BCryptNet.Verify(request.Password, user.PasswordHash))
                return BadRequest("Invalid login or password");

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, request.Login)
            };
            var accessTokenValue = _tokenService.GenerateAccessToken(claims);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();
            var refreshTokenExpiryTime = DateTime.UtcNow.AddDays(2);

            var refreshToken = user.RefreshTokens?.FirstOrDefault(i => i.ExpiryTime <= DateTime.Now);

            if (refreshToken is null)
            {
                refreshToken = new RefreshToken()
                {
                    User = user,
                    Value = refreshTokenValue,
                    ExpiryTime = refreshTokenExpiryTime
                };

                _dbContext.RefreshTokens.Add(refreshToken);
            }
            else
            {
                refreshToken.Value = refreshTokenValue;
                refreshToken.ExpiryTime = refreshTokenExpiryTime;
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new LoggedInResponse()
            {
                Tokens = new TokensDTO {
                    AccessToken = accessTokenValue,
                    RefreshToken = refreshTokenValue
                },
                User = new UserReadDTO().FromModel(user),
            });
        }

        [HttpPost("Logout"), Authorize]
        public async Task<ActionResult> Logout(LogoutRequest logout)
        {
            var user = await getCurrentUserAsync();
            var refreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(i => i.Value == logout.RefreshToken && i.UserId == user.Id);
                
            if (refreshToken is null) 
                return NotFound();

            _dbContext.RefreshTokens.Remove(refreshToken);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Register")]
        public async Task<ActionResult<UserReadDTO>> Register(UserCreateDTO userCreateDTO)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(i => i.Login == userCreateDTO.Login);

            if (user is not null)
                return BadRequest("Login is already in use");

            user = userCreateDTO.ToModel();
            user.PasswordHash = BCryptNet.HashPassword(userCreateDTO.Password);

            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            return Ok(new UserReadDTO().FromModel(user));
        }
    }
}
