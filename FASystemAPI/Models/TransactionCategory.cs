using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models
{
    public class TransactionCategory : BaseModel<Transaction>
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public int UserId { get; set; }

        public int TransactionTypeId { get; set; }

        public virtual User? User { get; set; }

        public virtual TransactionType? TransactionType { get; set; }

        public override void UpdateWith(Transaction model)
        {
            throw new NotImplementedException();
        }
    }
}
