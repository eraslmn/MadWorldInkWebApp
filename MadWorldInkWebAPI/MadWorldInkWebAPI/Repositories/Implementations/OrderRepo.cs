using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MadWorldInkWebAPI.Repositories
{
    public class OrderRepo : IOrderRepo
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderRepo(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderDTO>>(orders);
        }

        public async Task<OrderDTO> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            return _mapper.Map<OrderDTO>(order);
        }

        public async Task<OrderDTO> CreateOrder(OrderDTO orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);

            // Add the order to the context and save changes
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Return the created order as a DTO
            return _mapper.Map<OrderDTO>(order);
        }

        public async Task<OrderDTO> UpdateOrder(int id, OrderDTO orderDto)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return null;
            }

            _mapper.Map(orderDto, order);
            await _context.SaveChangesAsync();
            return _mapper.Map<OrderDTO>(order);
        }

        public async Task DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Select(o => new OrderDTO
                {
                    OrderId = o.Id, // Use the correct property name here
                    UserId = o.UserId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Items = o.Items.Select(i => new OrderItemDTO
                    {
                        ItemId = i.Id,
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        Price = i.Price
                    }).ToList()
                })
                .ToListAsync();
        }

    }
}
