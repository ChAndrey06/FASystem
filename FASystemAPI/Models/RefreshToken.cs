namespace FASystemAPI.Models
{
    public class RefreshToken : BaseModel<RefreshToken>
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Value { get; set; } = string.Empty;

        public DateTime? ExpiryTime { get; set; }

        public virtual User? User { get; set; }

        public override void UpdateWith(RefreshToken model)
        {
            throw new NotImplementedException();
        }
    }
}
