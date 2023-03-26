namespace FASystemAPI.Models.DTO
{
    public class TransactionCategoryReadDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? TransactionTypeName { get; set; }

        public TransactionCategoryReadDTO FromModel(TransactionCategory category)
        {
            Id = category.Id;
            Name = category.Name;
            TransactionTypeName = category.TransactionType?.Name;

            return this;
        }
    }
}
