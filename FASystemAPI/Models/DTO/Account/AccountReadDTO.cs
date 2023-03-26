namespace FASystemAPI.Models.DTO
{
    public class AccountReadDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public int CurrencyId { get; set; }

        public AccountReadDTO FromModel(Account account)
        {
            Id = account.Id;
            Name = account.Name;
            Balance = account.Balance;
            CurrencyId = account.CurrencyId;

            return this;
        }
    }
}
