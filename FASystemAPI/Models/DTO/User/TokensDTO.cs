namespace FASystemAPI.Models.DTO
{
    public class TokensDTO
    {
        public string AccessToken { get; set; } = string.Empty;

        public string RefreshToken { get; set; } = string.Empty;
    }
}