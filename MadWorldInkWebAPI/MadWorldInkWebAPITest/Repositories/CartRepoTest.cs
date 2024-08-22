using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using MadWorldInkWebAPI.DTOs;
using AutoMapper;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories;

namespace MadWorldInkWebAPI.Tests.Repositories
{
    public class CartRepoTest
    {
        private readonly CartRepo _cartRepo;
        private readonly AppDbContext _context;
        private readonly Mock<IMapper> _mockMapper;

        public CartRepoTest()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;

            _context = new AppDbContext(options);
            _mockMapper = new Mock<IMapper>();
            _cartRepo = new CartRepo(_context, _mockMapper.Object);
        }

        [Fact]
        public async Task GetCartById_ShouldReturnNull_WhenCartDoesNotExist()
        {
            // Act
            var result = await _cartRepo.GetCartById(1);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateCart_ShouldReturnCreatedCart()
        {
            // Arrange
            var cartDto = new CartDTO { CartId = 1, UserId = 1 };
            var cart = new Cart { Id = 1, UserId = 1 };

            _mockMapper.Setup(mapper => mapper.Map<Cart>(cartDto)).Returns(cart);
            _mockMapper.Setup(mapper => mapper.Map<CartDTO>(cart)).Returns(cartDto);

            // Act
            var result = await _cartRepo.CreateCart(cartDto);

            // Assert
            Assert.Equal(cartDto.CartId, result.CartId);
            Assert.Equal(1, await _context.Carts.CountAsync());
        }

        [Fact]
        public async Task DeleteCart_ShouldCallRemove_WhenCartExists()
        {
            // Arrange
            var cart = new Cart { Id = 1, UserId = 1 };
            await _context.Carts.AddAsync(cart);
            await _context.SaveChangesAsync();

            // Act
            await _cartRepo.DeleteCart(1);

            // Assert
            Assert.Equal(0, await _context.Carts.CountAsync());
        }
    }
}
