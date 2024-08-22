using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using Xunit;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Repositories.Interfaces;
using MadWorldInkWebAPI.Services;
using MadWorldInkWebAPI.Services.Interfaces;
using MadWorldInkWebAPI.Repositories.Implementations;

namespace MadWorldInkWebAPI.Tests.Services
{
    public class CartServiceTests
    {
        private readonly Mock<ICartRepo> _mockCartRepo;
        private readonly Mock<IProductRepo> _mockProductRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ICartService _cartService;

        public CartServiceTests()
        {
            _mockCartRepo = new Mock<ICartRepo>();
            _mockProductRepo = new Mock<IProductRepo>();
            _mockMapper = new Mock<IMapper>();
            _cartService = new CartService(_mockCartRepo.Object, _mockProductRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetCarts_ShouldReturnListOfCarts()
        {
            // Arrange
            var carts = new List<CartDTO> { new CartDTO() };
            _mockCartRepo.Setup(repo => repo.GetCarts()).ReturnsAsync(carts);

            // Act
            var result = await _cartService.GetCarts();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            _mockCartRepo.Verify(repo => repo.GetCarts(), Times.Once);
        }

        [Fact]
        public async Task GetCartById_ShouldReturnCart()
        {
            // Arrange
            var cartId = 1;
            var cart = new CartDTO { CartId = cartId };
            _mockCartRepo.Setup(repo => repo.GetCartById(cartId)).ReturnsAsync(cart);

            // Act
            var result = await _cartService.GetCartById(cartId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(cartId, result.CartId);
            _mockCartRepo.Verify(repo => repo.GetCartById(cartId), Times.Once);
        }

        [Fact]
        public async Task CreateCart_ShouldReturnCreatedCart()
        {
            // Arrange
            var cartDto = new CartDTO();
            _mockCartRepo.Setup(repo => repo.CreateCart(cartDto)).ReturnsAsync(cartDto);

            // Act
            var result = await _cartService.CreateCart(cartDto);

            // Assert
            Assert.NotNull(result);
            _mockCartRepo.Verify(repo => repo.CreateCart(cartDto), Times.Once);
        }

        [Fact]
        public async Task UpdateCart_ShouldReturnUpdatedCart()
        {
            // Arrange
            var cartId = 1;
            var cartDto = new CartDTO { CartId = cartId };
            _mockCartRepo.Setup(repo => repo.UpdateCart(cartId, cartDto)).ReturnsAsync(cartDto);

            // Act
            var result = await _cartService.UpdateCart(cartId, cartDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(cartId, result.CartId);
            _mockCartRepo.Verify(repo => repo.UpdateCart(cartId, cartDto), Times.Once);
        }

        [Fact]
        public async Task AddProductToCart_ShouldReturnUpdatedCartWithProduct()
        {
            // Arrange
            var cartId = 1;
            var productId = 2;
            var quantity = 1;

            var cart = new CartDTO { CartId = cartId, Items = new List<CartItemDTO>() };
            var product = new ProductDTO { Id = productId, Name = "Product", Price = 10.0m };

            _mockCartRepo.Setup(repo => repo.GetCartById(cartId)).ReturnsAsync(cart);
            _mockProductRepo.Setup(repo => repo.GetProductById(productId)).ReturnsAsync(product);
            _mockCartRepo.Setup(repo => repo.UpdateCart(cartId, cart)).ReturnsAsync(cart);

            // Act
            var result = await _cartService.AddProductToCart(cartId, productId, quantity);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Items);
            Assert.Equal(productId, result.Items[0].ProductId);
            Assert.Equal(quantity, result.Items[0].Quantity);
            _mockCartRepo.Verify(repo => repo.GetCartById(cartId), Times.Once);
            _mockProductRepo.Verify(repo => repo.GetProductById(productId), Times.Once);
            _mockCartRepo.Verify(repo => repo.UpdateCart(cartId, cart), Times.Once);
        }
    }
}
