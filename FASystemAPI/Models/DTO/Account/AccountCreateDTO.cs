using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models.DTO
{
    public class AccountCreateDTO
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public decimal Balance { get; set; }

        public Account ToModel() 
        {
            return new Account()
            {
                Name = Name,
                Balance = Balance
            };
        }
    }
}
