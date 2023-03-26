using System.ComponentModel.DataAnnotations;
using static FASystemAPI.Models.TransactionType;

namespace FASystemAPI.Models
{
    public class Transaction : BaseModel<Transaction>
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int TypeId { get; set; }

        public int AccountId { get; set; }

        public int CategoryId { get; set; }

        public virtual TransactionType Type { get; set; } = null!;

        public virtual Account Account { get; set; } = null!;

        public virtual TransactionCategory Category { get; set; } = null!;

        public override void UpdateWith(Transaction model)
        {
            Amount = model.Amount;
            Description = model.Description;
            TypeId = model.TypeId;
            AccountId = model.AccountId;
            CategoryId = model.CategoryId;
        }

        public void Conduct(Account account) 
        {
            if (TypeId == (int)TransactionTypesEnum.Income)
                account.Balance += Amount;
            else if (TypeId == (int)TransactionTypesEnum.Expense)
                account.Balance -= Amount;
        }

        public void Conduct() 
        {
            Conduct(Account);
        }
        
        public void Rollback(Account account)
        {
            if (TypeId == (int)TransactionTypesEnum.Income)
                account.Balance -= Amount;
            else if (TypeId == (int)TransactionTypesEnum.Expense)
                account.Balance += Amount;
        }

        public void Rollback() 
        {
            Rollback(Account);
        }
    }
}
