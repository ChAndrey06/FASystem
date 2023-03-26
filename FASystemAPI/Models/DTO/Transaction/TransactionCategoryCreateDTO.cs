using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models.DTO
{
    public class TransactionCategoryCreateDTO
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int TransactionTypeId { get; set; }

        public TransactionCategory ToModel()
        {
            return new TransactionCategory()
            {
                Name = Name,
                TransactionTypeId = TransactionTypeId,
            };
        }
    }
}
