using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MadWorldInkWebAPI.Repositories
{
    public class CartRepo : ICartRepo
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CartRepo(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Retrieve all carts
        public async Task<IEnumerable<CartDTO>> GetCarts()
        {
            var carts = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .ToListAsync();
            return _mapper.Map<IEnumerable<CartDTO>>(carts);
        }

        // Retrieve a cart by its ID
        public async Task<CartDTO> GetCartById(int id)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cart == null)
            {
                return null;
            }

            var cartDto = _mapper.Map<CartDTO>(cart);

            // Update TotalPrice for each cart item
            foreach (var item in cartDto.Items)
            {
                item.Price = item.Price != 0 ? item.Price : cart.Items.First(i => i.ProductId == item.ProductId).Product.Price;
                item.TotalPrice = item.Quantity * item.Price;
            }

            return cartDto;
        }


        // Create a new cart
        public async Task<CartDTO> CreateCart(CartDTO cartDto)
        {
            var cart = _mapper.Map<Cart>(cartDto);
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
            return _mapper.Map<CartDTO>(cart);
        }
        // Retrieve a cart by User ID
public async Task<CartDTO> GetCartByUserId(int userId)
{
    var cart = await _context.Carts
        .Include(c => c.Items)
        .ThenInclude(i => i.Product)
        .FirstOrDefaultAsync(c => c.UserId == userId);

    if (cart == null)
    {
        return null; // or throw an exception depending on how you want to handle this
    }

    var cartDto = _mapper.Map<CartDTO>(cart);

    // Update TotalPrice for each cart item
    foreach (var item in cartDto.Items)
    {
        item.Price = item.Price != 0 ? item.Price : cart.Items.First(i => i.ProductId == item.ProductId).Product.Price;
        item.TotalPrice = item.Quantity * item.Price;
    }

    return cartDto;
}


        // Update an existing cart
        public async Task<CartDTO> UpdateCart(int id, CartDTO cartDto)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cart == null)
            {
                return null;
            }

            _mapper.Map(cartDto, cart);
            await _context.SaveChangesAsync();
            return _mapper.Map<CartDTO>(cart);
        }

        // Delete a cart
        public async Task DeleteCart(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart != null)
            {
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();
            }
        }
    }
}
