using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Mapping;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MadWorldInkWebAPI.Tests.Repositories
{
    public class OrderRepoTests
    {
        private AppDbContext _context;
        private readonly IMapper _mapper;
        private OrderRepo _orderRepo;

        public OrderRepoTests()
        {
            // Setup AutoMapper
            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfile()); // Assuming you have a MappingProfile class for AutoMapper
            });
            _mapper = mockMapper.CreateMapper();
        }

        private void InitializeContext()
        {
            // Reinitialize the in-memory database before each test
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}") // Unique database name for each test
                .Options;

            _context = new AppDbContext(options);
            _orderRepo = new OrderRepo(_context, _mapper);
        }

        [Fact]
        public async Task GetOrders_ShouldReturnAllOrders()
        {
            // Arrange
            InitializeContext();
            var orders = new List<Order>
            {
                new Order { Id = 1, UserId = 1 },
                new Order { Id = 2, UserId = 2 }
            };

            await _context.Orders.AddRangeAsync(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _orderRepo.GetOrders();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetOrderById_ShouldReturnOrder_WhenOrderExists()
        {
            // Arrange
            InitializeContext();
            var order = new Order { Id = 3, UserId = 1 };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Act
            var result = await _orderRepo.GetOrderById(3);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.OrderId);
        }

        [Fact]
        public async Task GetOrderById_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            // Arrange
            InitializeContext();

            // Act
            var result = await _orderRepo.GetOrderById(99);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateOrder_ShouldAddOrderToDatabase()
        {
            // Arrange
            InitializeContext();
            var orderDto = new OrderDTO
            {
                UserId = 1,
                OrderDate = DateTime.UtcNow,
                TotalAmount = 100m,
                Items = new List<OrderItemDTO>
        {
            new OrderItemDTO { ProductId = 1, Quantity = 2, Price = 50m }
        }
            };

         
            var result = await _orderRepo.CreateOrder(orderDto);

            Assert.NotNull(result);
            Assert.Equal(1, _context.Orders.Count());  
            Assert.Equal(1, result.OrderId); 
            Assert.Equal(orderDto.UserId, result.UserId); 
            Assert.Equal(orderDto.TotalAmount, result.TotalAmount); 
        }

        [Fact]
        public async Task UpdateOrder_ShouldUpdateExistingOrder()
        {
            // Arrange
            InitializeContext();
            var order = new Order { Id = 5, UserId = 1 };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            var updatedOrderDto = new OrderDTO { OrderId = 5, UserId = 2 };

            // Act
            var result = await _orderRepo.UpdateOrder(5, updatedOrderDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.UserId);
        }

        [Fact]
        public async Task UpdateOrder_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            // Arrange
            InitializeContext();
            var orderDto = new OrderDTO { OrderId = 99, UserId = 1 };

            // Act
            var result = await _orderRepo.UpdateOrder(99, orderDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteOrder_ShouldRemoveOrderFromDatabase()
        {
            // Arrange
            InitializeContext();
            var order = new Order { Id = 6, UserId = 1 };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Act
            await _orderRepo.DeleteOrder(6);

            // Assert
            Assert.Equal(0, _context.Orders.Count());
        }

        [Fact]
        public async Task GetOrdersByUserId_ShouldReturnOrdersForGivenUser()
        {
            // Arrange
            InitializeContext();
            var orders = new List<Order>
            {
                new Order { Id = 7, UserId = 1 },
                new Order { Id = 8, UserId = 1 },
                new Order { Id = 9, UserId = 2 }
            };

            await _context.Orders.AddRangeAsync(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _orderRepo.GetOrdersByUserId(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }
    }
}
