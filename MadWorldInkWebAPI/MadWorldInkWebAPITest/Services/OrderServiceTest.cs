using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using MadWorldInkWebAPI.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MadWorldInkWebAPITest.Services
{
    public class OrderServiceTest
    {
        private readonly Mock<IOrderRepo> _mockOrderRepo;
        private readonly Mock<ICartRepo> _mockCartRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly OrderService _orderService;

        public OrderServiceTest()
        {
            _mockOrderRepo = new Mock<IOrderRepo>();
            _mockCartRepo = new Mock<ICartRepo>();
            _mockMapper = new Mock<IMapper>();
            _orderService = new OrderService(_mockOrderRepo.Object, _mockCartRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetOrders_ShouldReturnAllOrders()
        {
            // Arrange
            var orders = new List<OrderDTO>
            {
                new OrderDTO { OrderId = 1, UserId = 1, OrderDate = DateTime.Now, TotalAmount = 100.00m },
                new OrderDTO { OrderId = 2, UserId = 2, OrderDate = DateTime.Now, TotalAmount = 150.00m }
            };

            _mockOrderRepo.Setup(repo => repo.GetOrders()).ReturnsAsync(orders);

            // Act
            var result = await _orderService.GetOrders();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetOrderById_ShouldReturnOrder_WhenOrderExists()
        {
            // Arrange
            var order = new OrderDTO { OrderId = 1, UserId = 1, OrderDate = DateTime.Now, TotalAmount = 100.00m };
            _mockOrderRepo.Setup(repo => repo.GetOrderById(1)).ReturnsAsync(order);

            // Act
            var result = await _orderService.GetOrderById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.OrderId);
        }

        [Fact]
        public async Task CreateOrder_ShouldCreateOrder_WhenCartExistsAndHasItems()
        {
            // Arrange
            var cartItems = new List<CartItemDTO>
            {
                new CartItemDTO { ProductId = 1, ProductName = "Product 1", Quantity = 2, Price = 50.00m },
                new CartItemDTO { ProductId = 2, ProductName = "Product 2", Quantity = 1, Price = 100.00m }
            };
            var cart = new CartDTO { CartId = 1, UserId = 1, Items = cartItems };

            var orderDto = new OrderDTO { UserId = 1 };

            _mockCartRepo.Setup(repo => repo.GetCartByUserId(1)).ReturnsAsync(cart);
            _mockOrderRepo.Setup(repo => repo.CreateOrder(It.IsAny<OrderDTO>()))
                          .ReturnsAsync((OrderDTO o) => o);

            // Act
            var result = await _orderService.CreateOrder(orderDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200.00m, result.TotalAmount);
            _mockCartRepo.Verify(repo => repo.DeleteCart(cart.CartId), Times.Once);
        }

        [Fact]
        public async Task CreateOrder_ShouldThrowException_WhenCartIsEmpty()
        {
            // Arrange
            var cart = new CartDTO { CartId = 1, UserId = 1, Items = new List<CartItemDTO>() };

            var orderDto = new OrderDTO { UserId = 1 };

            _mockCartRepo.Setup(repo => repo.GetCartByUserId(1)).ReturnsAsync(cart);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _orderService.CreateOrder(orderDto));
            Assert.Equal("No items in the cart. Please add items to the cart before placing an order.", exception.Message);
        }

        [Fact]
        public async Task CreateOrder_ShouldThrowException_WhenCartDoesNotExist()
        {
            // Arrange
            var orderDto = new OrderDTO { UserId = 1 };

            _mockCartRepo.Setup(repo => repo.GetCartByUserId(1)).ReturnsAsync((CartDTO)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _orderService.CreateOrder(orderDto));
            Assert.Equal("Cart not found for user ID: 1.", exception.Message);
        }

        [Fact]
        public async Task UpdateOrder_ShouldReturnUpdatedOrder_WhenOrderExists()
        {
            // Arrange
            var orderDto = new OrderDTO { OrderId = 1, UserId = 1, OrderDate = DateTime.Now, TotalAmount = 100.00m };
            _mockOrderRepo.Setup(repo => repo.UpdateOrder(1, orderDto)).ReturnsAsync(orderDto);

            // Act
            var result = await _orderService.UpdateOrder(1, orderDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.OrderId);
        }

        [Fact]
        public async Task DeleteOrder_ShouldCallDeleteOrderInRepo()
        {
            // Arrange
            _mockOrderRepo.Setup(repo => repo.DeleteOrder(1)).Returns(Task.CompletedTask);

            // Act
            await _orderService.DeleteOrder(1);

            // Assert
            _mockOrderRepo.Verify(repo => repo.DeleteOrder(1), Times.Once);
        }

        [Fact]
        public async Task GetOrdersByUserId_ShouldReturnOrdersForUser()
        {
            // Arrange
            var orders = new List<OrderDTO>
            {
                new OrderDTO { OrderId = 1, UserId = 1, OrderDate = DateTime.Now, TotalAmount = 100.00m },
                new OrderDTO { OrderId = 2, UserId = 1, OrderDate = DateTime.Now, TotalAmount = 150.00m }
            };

            _mockOrderRepo.Setup(repo => repo.GetOrdersByUserId(1)).ReturnsAsync(orders);

            // Act
            var result = await _orderService.GetOrdersByUserId(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }
    }
}
