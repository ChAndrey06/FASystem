using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models.DTO
{
    public class TransactionCreateDTO
    {
        public decimal Amount { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int TypeId { get; set; }

        [Required]
        public int AccountId { get; set; }

        public int? CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public Transaction ToModel()
        {
            return new Transaction()
            {
                Amount = Amount,
                Description = Description,
                TypeId = TypeId,
                AccountId = AccountId,
                CategoryId = CategoryId ?? 0
            };
        }
    }
}
