using System.ComponentModel;
using FASystemAPI.Data;
using FASystemAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static FASystemAPI.Models.TransactionType;

namespace FASystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : BaseAPIController
    {
        public TransactionsController(FADbContext dbContext) : base(dbContext) { }

        [HttpGet]
        public async Task<ActionResult<List<TransactionReadDTO>>> GetAll(TransactionTypesEnum? typeId)
        {
            var user = await getCurrentUserAsync();
            var transactionList = await _dbContext.Transactions.Where
            (i => 
                i.Account.UserId == user.Id && 
                (typeId == null || (int)typeId == i.TypeId)
            ).ToListAsync();
            var transactionReadList = transactionList.Select(i => new TransactionReadDTO().FromModel(i)).ToList();

            return Ok(transactionReadList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionReadDTO>> GetById(int id, TransactionTypesEnum? typeId)
        {
            var user = await getCurrentUserAsync();

            var transaction = await _dbContext.Transactions.FirstOrDefaultAsync
            (i =>
                i.Id == id && 
                i.Account != null && 
                i.Account.UserId == user.Id &&
                (typeId == null || (int)typeId == i.TypeId)
            );

            if (transaction is null) 
            {
                return NotFound();
            }

            return Ok(new TransactionReadDTO().FromModel(transaction));
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<TransactionReadDTO>> Create(TransactionCreateDTO transactionCreateDTO)
        {
            var user = await getCurrentUserAsync();
            TransactionCategory? category;

            if (transactionCreateDTO.CategoryId is not null) 
            {
                category = await _dbContext.TransactionCategories.FirstOrDefaultAsync(i => 
                    i.Id == transactionCreateDTO.CategoryId &&
                    i.UserId == user.Id
                );

                if (category is null)
                    return NotFound("Category not found");
            }
            else if (transactionCreateDTO.CategoryName is not null) 
            {
                category = await _dbContext.TransactionCategories.FirstOrDefaultAsync(i => 
                    i.Name == transactionCreateDTO.CategoryName &&
                    i.UserId == user.Id
                );

                if (category is null)
                    category = new TransactionCategory()
                    {
                        Name = transactionCreateDTO.CategoryName,
                        TransactionTypeId = transactionCreateDTO.TypeId,
                        UserId = user.Id
                    };
            }
            else return BadRequest("Invalid category");
            
            var transaction = transactionCreateDTO.ToModel();
            var account = await _dbContext.Accounts.FirstOrDefaultAsync(i => 
                i.Id == transaction.AccountId &&
                i.UserId == user.Id
            );
            transaction.Category = category;

            if (account is null)
                return NotFound("Account was not found");

            if (category.TransactionTypeId != transaction.TypeId)
                return BadRequest("Invalid transaction type or category");
            
            transaction.Conduct(account);

            _dbContext.Transactions.Add(transaction);

            await _dbContext.Entry(transaction).Reference(t => t.Type).LoadAsync();
            await _dbContext.SaveChangesAsync();

            return Ok(new TransactionReadDTO().FromModel(transaction));
        }

        [HttpPost("Categories"), Authorize]
        public async Task<ActionResult<TransactionCategoryReadDTO>> CreateCategory(TransactionCategoryCreateDTO categoryCreateDTO)
        {
            var category = categoryCreateDTO.ToModel();

            if (!Enum.IsDefined(typeof(TransactionTypesEnum), category.TransactionTypeId))
            {
                return BadRequest("Selected transaction type is not allowed");
            }

            if (await _dbContext.TransactionCategories.AnyAsync(i =>
                i.Name == category.Name &&
                i.TransactionTypeId == category.TransactionTypeId
            ))
            {
                return BadRequest("Name should be unique");
            }

            category.User = await getCurrentUserAsync();
            _dbContext.TransactionCategories.Add(category);

            await _dbContext.SaveChangesAsync();

            return Ok(new TransactionCategoryReadDTO().FromModel(category));
        }

        [HttpGet("Categories"), Authorize]
        public async Task<ActionResult<TransactionCategoryReadDTO>> GetAllCategories(TransactionTypesEnum? transactionTypeId, string? filter)
        {
            var user = await getCurrentUserAsync();
            var categoryList = await _dbContext.TransactionCategories
                .Where(i => 
                    i.UserId == user.Id && 
                    (transactionTypeId == null || (int)transactionTypeId == i.TransactionTypeId) &&
                    (filter == null || i.Name.Contains(filter))
                )
                .ToListAsync();
            var categoryReadList = categoryList.Select(i => new TransactionCategoryReadDTO().FromModel(i)).ToList();

            return Ok(categoryReadList);
        }

        [HttpPut("{id}"), Authorize]
        public async Task<ActionResult<TransactionReadDTO>> UpdateById(int id, TransactionCreateDTO transactionCreateDTO)
        {
            var user = await getCurrentUserAsync();
            var newTransaction = transactionCreateDTO.ToModel();
            var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(i => i.Id == id && i.Account.UserId == user.Id);

            if (transaction is null)
                return NotFound();
            
            if (transaction.TypeId != newTransaction.TypeId)
                return BadRequest("TypeId cannot be changed");

            transaction.Rollback();

            if (transaction.AccountId != newTransaction.AccountId) 
            {
                var newAccount = await _dbContext.Accounts.FirstOrDefaultAsync(i => i.Id == newTransaction.AccountId && i.UserId == user.Id);

                if (newAccount is null) 
                    return NotFound("Account not found");

                transaction.Account = newAccount;
            }

            transaction.UpdateWith(newTransaction);
            transaction.Conduct();

            await _dbContext.SaveChangesAsync();

            return Ok(new TransactionReadDTO().FromModel(transaction));
        }
    }
}
