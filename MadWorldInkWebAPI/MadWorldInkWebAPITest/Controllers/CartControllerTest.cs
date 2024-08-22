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
    public class CartControllerTest
    {
        private readonly Mock<ICartService> _mockCartService;
        private readonly CartController _cartController;

        public CartControllerTest()
        {
            _mockCartService = new Mock<ICartService>();
            _cartController = new CartController(_mockCartService.Object);
        }

        [Fact]
        public async Task GetCarts_ShouldReturnAllCarts()
        {
            // Arrange
            var carts = new List<CartDTO>
            {
                new CartDTO { CartId = 1, UserId = 1 },
                new CartDTO { CartId = 2, UserId = 2 }
            };

            _mockCartService.Setup(service => service.GetCarts()).ReturnsAsync(carts);

            // Act
            var result = await _cartController.GetCarts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(carts, okResult.Value);
        }

        [Fact]
        public async Task GetCartById_ShouldReturnCart_WhenCartExists()
        {
            // Arrange
            var cart = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.GetCartById(1)).ReturnsAsync(cart);

            // Act
            var result = await _cartController.GetCartById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(cart, okResult.Value);
        }

        [Fact]
        public async Task GetCartById_ShouldReturnNotFound_WhenCartDoesNotExist()
        {
            // Arrange
            _mockCartService.Setup(service => service.GetCartById(1)).ReturnsAsync((CartDTO)null);

            // Act
            var result = await _cartController.GetCartById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateCart_ShouldReturnCreatedCart()
        {
            // Arrange
            var cartDto = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.CreateCart(cartDto)).ReturnsAsync(cartDto);

            // Act
            var result = await _cartController.CreateCart(cartDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(cartDto, createdAtActionResult.Value);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnNoContent_WhenCartIsUpdated()
        {
            // Arrange
            var cartDto = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.UpdateCart(1, cartDto)).ReturnsAsync(cartDto);

            // Act
            var result = await _cartController.UpdateCart(1, cartDto);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteCart_ShouldReturnNoContent_WhenCartIsDeleted()
        {
            // Arrange
            var cart = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.GetCartById(1)).ReturnsAsync(cart);
            _mockCartService.Setup(service => service.DeleteCart(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _cartController.DeleteCart(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockCartService.Verify(service => service.DeleteCart(1), Times.Once);
        }

        [Fact]
        public async Task AddProductToCart_ShouldReturnUpdatedCart_WhenProductIsAdded()
        {
            // Arrange
            var cartDto = new CartDTO { CartId = 1, UserId = 1 };
            var addProductDto = new AddProductToCartDTO { ProductId = 1, Quantity = 2 };

            _mockCartService.Setup(service => service.AddProductToCart(1, addProductDto.ProductId, addProductDto.Quantity))
                            .ReturnsAsync(cartDto);

            // Act
            var result = await _cartController.AddProductToCart(1, addProductDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(cartDto, okResult.Value);
        }

        [Fact]
        public async Task RemoveCartItem_ShouldReturnNoContent_WhenItemIsRemoved()
        {
            // Arrange
            var cart = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.GetCartById(1)).ReturnsAsync(cart);
            _mockCartService.Setup(service => service.RemoveCartItem(1, 1)).ReturnsAsync(true);

            // Act
            var result = await _cartController.RemoveCartItem(1, 1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockCartService.Verify(service => service.RemoveCartItem(1, 1), Times.Once);
        }

        [Fact]
        public async Task UpdateCartItemQuantity_ShouldReturnUpdatedCart_WhenQuantityIsUpdated()
        {
            // Arrange
            var cartDto = new CartDTO { CartId = 1, UserId = 1 };
            _mockCartService.Setup(service => service.UpdateCartItemQuantity(1, 1, 2)).ReturnsAsync(cartDto);

            // Act
            var result = await _cartController.UpdateCartItemQuantity(1, 1, 2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(cartDto, okResult.Value);
        }
    }
}
