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
    public class OrderService : IOrderService
    {
        private readonly IOrderRepo _orderRepo;
        private readonly ICartRepo _cartRepo;  // Injecting CartRepo to fetch cart data
        private readonly IMapper _mapper;

        public OrderService(IOrderRepo orderRepo, ICartRepo cartRepo, IMapper mapper)
        {
            _orderRepo = orderRepo;
            _cartRepo = cartRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
            return await _orderRepo.GetOrders();
        }

        public async Task<OrderDTO> GetOrderById(int id)
        {
            return await _orderRepo.GetOrderById(id);
        }

        public async Task<OrderDTO> CreateOrder(OrderDTO orderDto)
        {
            // Fetch the user's cart based on UserId
            var cart = await _cartRepo.GetCartByUserId(orderDto.UserId);
            if (cart == null)
            {
                throw new Exception($"Cart not found for user ID: {orderDto.UserId}.");
            }

            if (!cart.Items.Any())
            {
                throw new Exception("No items in the cart. Please add items to the cart before placing an order.");
            }

            // Map cart items to order items
            var orderItems = new List<OrderItemDTO>();
            decimal totalAmount = 0;

            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItemDTO
                {
                    ProductId = cartItem.ProductId,
                    ProductName = cartItem.ProductName,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Price
                };

                orderItems.Add(orderItem);
                totalAmount += cartItem.Quantity * cartItem.Price;
            }

            // Set the order details
            orderDto.Items = orderItems;
            orderDto.TotalAmount = totalAmount;
            orderDto.OrderDate = DateTime.UtcNow;

            // Save the order to the database
            var createdOrder = await _orderRepo.CreateOrder(orderDto);

            // After saving the order, delete the cart
            await _cartRepo.DeleteCart(cart.CartId);

            return createdOrder;
        }
        public async Task<OrderDTO> UpdateOrder(int id, OrderDTO orderDto)
        {
            return await _orderRepo.UpdateOrder(id, orderDto);
        }

        public async Task DeleteOrder(int id)
        {
            await _orderRepo.DeleteOrder(id);
        }
        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId)
        {
            return await _orderRepo.GetOrdersByUserId(userId);
        }
    }
}
