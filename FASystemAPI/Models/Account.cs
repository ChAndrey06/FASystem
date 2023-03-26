using System.ComponentModel.DataAnnotations;

namespace FASystemAPI.Models
{
    public class Account : BaseModel<Account>
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public decimal Balance { get; set; }

        public int UserId { get; set; }

        public int CurrencyId { get; set; }

        public bool Deleted { get; set; } = false;

        public virtual User User { get; set; } = null!;

        public override void UpdateWith(Account account)
        {
            this.Name = account.Name;
            this.Balance = account.Balance;
            this.UserId = account.UserId;
            this.User = account.User;
        }
    }
}
