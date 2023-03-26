namespace FASystemAPI.Models.DTO
{
    public class TransactionReadDTO
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;

        public int TypeId { get; set; }

        public int CategoryId { get; set; }

        public int AccountId { get; set; }

        public string TypeName { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

        public string AccountName { get; set; } = string.Empty;

        public TransactionReadDTO FromModel(Transaction transaction)
        {
            Id = transaction.Id;
            Amount = transaction.Amount;
            Description = transaction.Description;
            CategoryId = transaction.CategoryId;
            TypeId = transaction.TypeId;
            AccountId = transaction.AccountId;
            TypeName = transaction.Type.Name;
            CategoryName = transaction.Category.Name;
            AccountName = transaction.Account.Name;

            return this;
        }
    }
}
