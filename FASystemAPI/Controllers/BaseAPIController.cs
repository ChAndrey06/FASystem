using FASystemAPI.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FASystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseAPIController : ControllerBase
    {
        protected readonly FADbContext _dbContext;

        public BaseAPIController(FADbContext dbContext)
        {
            _dbContext = dbContext;
        }

        protected async Task<User> getCurrentUserAsync()
        {
            string? currentUserLogin = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            User? currentUser = await _dbContext.Users.FirstOrDefaultAsync(i => i.Login == currentUserLogin);

            if (currentUser is null) throw new BadHttpRequestException("Unauthorized error", 401);

            return currentUser;
        }
    }
}
