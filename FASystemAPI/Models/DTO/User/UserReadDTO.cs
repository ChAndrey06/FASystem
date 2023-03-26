namespace FASystemAPI.Models.DTO
{
    public class UserReadDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Login { get; set; } = string.Empty;

        public UserReadDTO FromModel(User user)
        {
            this.Id = user.Id;
            this.Name = user.Name;
            this.Login = user.Login;

            return this;
        }
    }
}
