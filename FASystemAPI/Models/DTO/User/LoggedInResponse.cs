namespace FASystemAPI.Models.DTO
{
    public class LoggedInResponse
    {
        public UserReadDTO? User { get; set; }

        public TokensDTO? Tokens { get; set; }
    }
}
