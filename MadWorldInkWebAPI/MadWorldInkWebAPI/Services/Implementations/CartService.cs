using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using MadWorldInkWebAPI.Services.Interfaces;

namespace MadWorldInkWebAPI.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepo _cartRepo;
        private readonly IProductRepo _productRepo;
        private readonly IMapper _mapper;

        public CartService(ICartRepo cartRepo, IProductRepo productRepo, IMapper mapper)
        {
            _cartRepo = cartRepo;
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CartDTO>> GetCarts()
        {
            return await _cartRepo.GetCarts();
        }

        public async Task<CartDTO> GetCartById(int id)
        {
            return await _cartRepo.GetCartById(id);
        }

        public async Task<CartDTO> CreateCart(CartDTO cartDto)
        {
            return await _cartRepo.CreateCart(cartDto);
        }

        public async Task<CartDTO> UpdateCart(int id, CartDTO cartDto)
        {
            return await _cartRepo.UpdateCart(id, cartDto);
        }

        public async Task DeleteCart(int id)
        {
            await _cartRepo.DeleteCart(id);
        }
        public async Task<bool> RemoveCartItem(int cartId, int itemId)
        {
            var cart = await _cartRepo.GetCartById(cartId);
            if (cart == null)
            {
                return false;
            }

            var cartItem = cart.Items.FirstOrDefault(item => item.ItemId == itemId);
            if (cartItem != null)
            {
                cart.Items.Remove(cartItem);
                await _cartRepo.UpdateCart(cartId, cart);
                return true;
            }

            return false;
        }


        public async Task<CartDTO> UpdateCartItemQuantity(int cartId, int itemId, int quantity)
        {
            var cart = await _cartRepo.GetCartById(cartId);
            if (cart == null)
            {
                return null;
            }

            var cartItem = cart.Items.Find(item => item.ItemId == itemId);
            if (cartItem == null)
            {
                return null;
            }

            cartItem.Quantity = quantity;
            cartItem.TotalPrice = cartItem.Quantity * cartItem.Price;

            await _cartRepo.UpdateCart(cartId, cart);

            return cart;
        }
        public async Task<CartDTO> AddProductToCart(int cartId, int productId, int quantity)
        {
            var cart = await _cartRepo.GetCartById(cartId);
            if (cart == null)
            {
                return null;
            }

            var product = await _productRepo.GetProductById(productId);
            if (product == null)
            {
                return null;
            }

            var cartItem = cart.Items.FirstOrDefault(item => item.ProductId == productId);
            if (cartItem != null)
            {
                cartItem.Quantity += quantity;
                cartItem.Price = product.Price;
                cartItem.TotalPrice = cartItem.Quantity * cartItem.Price;
            }
            else
            {
                cart.Items.Add(new CartItemDTO
                {
                    ProductId = productId,
                    ProductName = product.Name,
                    Quantity = quantity,
                    Price = product.Price,
                    TotalPrice = quantity * product.Price
                });
            }

            return await _cartRepo.UpdateCart(cartId, cart);
        }
    }
}
