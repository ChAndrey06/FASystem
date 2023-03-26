namespace FASystemAPI.Data
{
    public class FADbContext : DbContext
    {
        public FADbContext(DbContextOptions<FADbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<TransactionCategory> TransactionCategories { get; set; }

        public DbSet<TransactionType> TransactionTypes { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
