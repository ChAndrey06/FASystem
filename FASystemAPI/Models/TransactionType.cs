using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FASystemAPI.Models
{
    public class TransactionType : BaseModel<Transaction>
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [MaxLength(20)]
        public string Name { get; set; } = string.Empty;

        public override void UpdateWith(Transaction model)
        {
            throw new NotImplementedException();
        }

        public enum TransactionTypesEnum
        {
            Income = 1,
            Expense = 2
        }
    }
}
