using FASystemAPI.Data;
using FASystemAPI.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FASystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : BaseAPIController
    {
        public AccountsController(FADbContext dbContext) : base(dbContext) { }

        [HttpGet, Authorize]
        public async Task<ActionResult<List<AccountReadDTO>>> GetAll()
        {
            var accountList = await _dbContext.Accounts.Where(i => !i.Deleted).OrderBy(i => i.Name).ToListAsync();
            var accountReadList = accountList.Select(i => new AccountReadDTO().FromModel(i)).ToList();

            return Ok(accountReadList);
        }

        [HttpPost, Authorize]
        public async Task<ActionResult<AccountReadDTO>> Create(AccountCreateDTO accountCreateDTO)
        {
            var account = accountCreateDTO.ToModel();
            account.User = await getCurrentUserAsync();

            _dbContext.Accounts.Add(account);
            await _dbContext.SaveChangesAsync();

            return Ok(new AccountReadDTO().FromModel(account));
        }
    }
}
