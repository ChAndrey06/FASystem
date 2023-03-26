using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models.DTO
{
    public class UserCreateDTO
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Login { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(20)]
        public string Password { get; set; } = string.Empty;

        public User ToModel() 
        {
            return new User {
                Name = Name,
                Login = Login
            };
        }
    }
}
