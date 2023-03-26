namespace FASystemAPI.Models
{
    public abstract class BaseModel<T>
    {
        public abstract void UpdateWith(T model);
    }
}
