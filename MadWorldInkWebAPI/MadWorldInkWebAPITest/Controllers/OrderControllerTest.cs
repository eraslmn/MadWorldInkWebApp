using MadWorldInkWebAPI.Controllers;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MadWorldInkWebAPITest.Controllers
{
    public class OrderControllerTest
    {
        [Fact]
        public async Task GetOrders_ShouldReturnAllOrders()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var orders = new List<OrderDTO>
            {
                new OrderDTO
                {
                    OrderId = 1,
                    UserId = 1,
                    OrderDate = DateTime.Now,
                    TotalAmount = 100.00m,
                    Items = new List<OrderItemDTO>
                    {
                        new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                    }
                },
                new OrderDTO
                {
                    OrderId = 2,
                    UserId = 2,
                    OrderDate = DateTime.Now,
                    TotalAmount = 150.00m,
                    Items = new List<OrderItemDTO>
                    {
                        new OrderItemDTO { ProductName = "Product 2", Quantity = 3, Price = 50.00m }
                    }
                }
            };

            mockService.Setup(service => service.GetOrders()).ReturnsAsync(orders);

            // Act
            var result = await controller.GetOrders();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(orders, okResult.Value);
        }

        [Fact]
        public async Task GetOrderById_ShouldReturnOrder_WhenOrderExists()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var order = new OrderDTO
            {
                OrderId = 1,
                UserId = 1,
                OrderDate = DateTime.Now,
                TotalAmount = 100.00m,
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                }
            };

            mockService.Setup(service => service.GetOrderById(1)).ReturnsAsync(order);

            // Act
            var result = await controller.GetOrderById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(order, okResult.Value);
        }

        [Fact]
        public async Task GetOrderById_ShouldReturnNotFound_WhenOrderDoesNotExist()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            mockService.Setup(service => service.GetOrderById(1)).ReturnsAsync((OrderDTO)null);

            // Act
            var result = await controller.GetOrderById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateOrder_ShouldReturnCreatedOrder()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var orderDto = new OrderDTO
            {
                OrderId = 1,
                UserId = 1,
                OrderDate = DateTime.Now,
                TotalAmount = 100.00m,
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                }
            };

            mockService.Setup(service => service.CreateOrder(orderDto)).ReturnsAsync(orderDto);

            // Act
            var result = await controller.CreateOrder(orderDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(orderDto, createdAtActionResult.Value);
        }

        [Fact]
        public async Task UpdateOrder_ShouldReturnNoContent_WhenOrderIsUpdated()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var orderDto = new OrderDTO
            {
                OrderId = 1,
                UserId = 1,
                OrderDate = DateTime.Now,
                TotalAmount = 100.00m,
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                }
            };

            mockService.Setup(service => service.UpdateOrder(1, orderDto)).ReturnsAsync(orderDto);

            // Act
            var result = await controller.UpdateOrder(1, orderDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetOrdersByUserId_ShouldReturnOrders()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var orders = new List<OrderDTO>
            {
                new OrderDTO
                {
                    OrderId = 1,
                    UserId = 1,
                    OrderDate = DateTime.Now,
                    TotalAmount = 100.00m,
                    Items = new List<OrderItemDTO>
                    {
                        new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                    }
                },
                new OrderDTO
                {
                    OrderId = 2,
                    UserId = 1,
                    OrderDate = DateTime.Now,
                    TotalAmount = 150.00m,
                    Items = new List<OrderItemDTO>
                    {
                        new OrderItemDTO { ProductName = "Product 2", Quantity = 3, Price = 50.00m }
                    }
                }
            };

            mockService.Setup(service => service.GetOrdersByUserId(1)).ReturnsAsync(orders);

            // Act
            var result = await controller.GetOrdersByUserId(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(orders, okResult.Value);
        }

        [Fact]
        public async Task DeleteOrder_ShouldReturnNoContent_WhenOrderIsDeleted()
        {
            // Arrange
            var mockService = new Mock<IOrderService>();
            var controller = new OrderController(mockService.Object);

            var order = new OrderDTO
            {
                OrderId = 1,
                UserId = 1,
                OrderDate = DateTime.Now,
                TotalAmount = 100.00m,
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductName = "Product 1", Quantity = 2, Price = 50.00m }
                }
            };

            mockService.Setup(service => service.GetOrderById(1)).ReturnsAsync(order);
            mockService.Setup(service => service.DeleteOrder(1)).Returns(Task.CompletedTask);

            // Act
            var result = await controller.DeleteOrder(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            mockService.Verify(service => service.DeleteOrder(1), Times.Once);
        }
    }
}
