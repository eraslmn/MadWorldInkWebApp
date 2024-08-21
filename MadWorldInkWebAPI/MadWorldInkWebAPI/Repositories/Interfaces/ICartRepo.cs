using System.Collections.Generic;
using System.Threading.Tasks;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;

namespace MadWorldInkWebAPI.Repositories.Implementations
{
    public interface ICartRepo
    {
        Task<IEnumerable<CartDTO>> GetCarts();
        Task<CartDTO> GetCartById(int id);
        Task<CartDTO> CreateCart(CartDTO cartDto);
        Task<CartDTO> UpdateCart(int id, CartDTO cartDto);

        Task DeleteCart(int id);

          Task<CartDTO> GetCartByUserId(int userId);
    }
}
