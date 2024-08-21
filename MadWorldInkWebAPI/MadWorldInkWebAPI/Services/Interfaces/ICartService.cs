using MadWorldInkWebAPI.DTOs;

namespace MadWorldInkWebAPI.Services.Interfaces
{
    public interface ICartService
    {
        Task<IEnumerable<CartDTO>> GetCarts();
        Task<CartDTO> GetCartById(int id);
        Task<CartDTO> CreateCart(CartDTO cartDto);
        Task<CartDTO> UpdateCart(int id, CartDTO cartDto);
        Task<CartDTO> AddProductToCart(int cartId, int productId, int quantity);
        Task DeleteCart(int id);
        Task<bool> RemoveCartItem(int cartId, int itemId);
        Task<CartDTO> UpdateCartItemQuantity(int cartId, int itemId, int quantity);
    }
}
