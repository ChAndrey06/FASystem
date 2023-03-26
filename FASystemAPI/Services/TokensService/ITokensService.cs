using System.Security.Claims;

namespace FASystemAPI.Services
{
    public interface ITokensService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromToken(string token);
    }
}
