using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models.DTO
{
    public class RegisterRequest
    {
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Login { get; set; } = string.Empty;

        [MinLength(8), MaxLength(20)]
        public string Password { get; set; } = string.Empty;
    }
}
