using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using MadWorldInkWebAPI.Services;
using Moq;
using Xunit;

namespace MadWorldInkWebAPI.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepo> _productRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _productRepoMock = new Mock<IProductRepo>();
            _mapperMock = new Mock<IMapper>();
            _productService = new ProductService(_productRepoMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetProducts_ShouldReturnListOfProductDTOs()
        {
            // Arrange
            var products = new List<ProductDTO>
            {
                new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" },
                new ProductDTO { Id = 2, Name = "Product2", Description = "Description2", Price = 20, Category = "Category2", ImageUrl = "ImageUrl2", Details = "Details2" }
            };

            _productRepoMock.Setup(repo => repo.GetProducts()).ReturnsAsync(products);

            // Act
            var result = await _productService.GetProducts();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Equal("Product1", result.First().Name);
        }

        [Fact]
        public async Task GetProductById_ShouldReturnProductDTO()
        {
            // Arrange
            var product = new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" };

            _productRepoMock.Setup(repo => repo.GetProductById(1)).ReturnsAsync(product);

            // Act
            var result = await _productService.GetProductById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Product1", result.Name);
        }

        [Fact]
        public async Task GetProductsByCategory_ShouldReturnProductsOfSpecificCategory()
        {
            // Arrange
            var products = new List<ProductDTO>
            {
                new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" },
                new ProductDTO { Id = 2, Name = "Product2", Description = "Description2", Price = 20, Category = "Category1", ImageUrl = "ImageUrl2", Details = "Details2" }
            };

            _productRepoMock.Setup(repo => repo.GetProductsByCategory("Category1")).ReturnsAsync(products);

            // Act
            var result = await _productService.GetProductsByCategory("Category1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.All(result, p => Assert.Equal("Category1", p.Category));
        }

        [Fact]
        public async Task CreateProduct_ShouldAddProductAndReturnProductDTO()
        {
            // Arrange
            var productDto = new ProductDTO { Name = "NewProduct", Description = "NewDescription", Price = 30, Category = "NewCategory", ImageUrl = "NewImageUrl", Details = "NewDetails" };

            _productRepoMock.Setup(repo => repo.CreateProduct(productDto)).ReturnsAsync(productDto);

            // Act
            var result = await _productService.CreateProduct(productDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("NewProduct", result.Name);
        }

        [Fact]
        public async Task UpdateProduct_ShouldModifyExistingProductAndReturnProductDTO()
        {
            // Arrange
            var productDto = new ProductDTO { Id = 1, Name = "UpdatedProduct", Description = "UpdatedDescription", Price = 50, Category = "UpdatedCategory", ImageUrl = "UpdatedImageUrl", Details = "UpdatedDetails" };

            _productRepoMock.Setup(repo => repo.UpdateProduct(1, productDto)).ReturnsAsync(productDto);

            // Act
            var result = await _productService.UpdateProduct(1, productDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("UpdatedProduct", result.Name);
            Assert.Equal(50, result.Price);
        }

        [Fact]
        public async Task DeleteProduct_ShouldCallDeleteProductOnRepository()
        {
            // Arrange
            var productId = 1;
            _productRepoMock.Setup(repo => repo.DeleteProduct(productId)).Returns(Task.CompletedTask);

            // Act
            await _productService.DeleteProduct(productId);

            // Assert
            _productRepoMock.Verify(repo => repo.DeleteProduct(productId), Times.Once);
        }
    }
}
