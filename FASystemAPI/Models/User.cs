using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models
{
    public class User : BaseModel<User>
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Login { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public virtual ICollection<RefreshToken>? RefreshTokens { get; set; }

        public override void UpdateWith(User user)
        {
            this.Name = user.Name;
            this.Login = user.Login;
            this.PasswordHash = user.PasswordHash;
        }
    }
}
