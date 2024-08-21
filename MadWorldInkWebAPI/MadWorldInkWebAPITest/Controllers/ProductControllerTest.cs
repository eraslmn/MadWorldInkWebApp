using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.Controllers;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace MadWorldInkWebAPI.Tests.Controllers
{
    public class ProductControllerTest
    {
        private readonly Mock<IProductService> _productServiceMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IWebHostEnvironment> _webHostEnvironmentMock;
        private readonly Mock<ILogger<ProductController>> _loggerMock;
        private readonly ProductController _productController;

        public ProductControllerTest()
        {
            _productServiceMock = new Mock<IProductService>();
            _mapperMock = new Mock<IMapper>();
            _webHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            _loggerMock = new Mock<ILogger<ProductController>>();
            _productController = new ProductController(_productServiceMock.Object, _mapperMock.Object, _webHostEnvironmentMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task GetProducts_ShouldReturnOkResult_WithListOfProductDTOs()
        {
            // Arrange
            var products = new List<ProductDTO>
            {
                new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" },
                new ProductDTO { Id = 2, Name = "Product2", Description = "Description2", Price = 20, Category = "Category2", ImageUrl = "ImageUrl2", Details = "Details2" }
            };
            _productServiceMock.Setup(service => service.GetProducts()).ReturnsAsync(products);

            // Act
            var result = await _productController.GetProducts();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<ProductDTO>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }

        [Fact]
        public async Task GetProductById_ShouldReturnOkResult_WithProductDTO()
        {
            // Arrange
            var product = new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" };
            _productServiceMock.Setup(service => service.GetProductById(1)).ReturnsAsync(product);

            // Act
            var result = await _productController.GetProductById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<ProductDTO>(okResult.Value);
            Assert.Equal(1, returnValue.Id);
        }

        [Fact]
        public async Task CreateProduct_ShouldReturnCreatedAtAction_WithProductDTO()
        {
            // Arrange
            var productDto = new ProductDTO { Name = "NewProduct", Description = "NewDescription", Price = 30, Category = "NewCategory", ImageUrl = "NewImageUrl", Details = "NewDetails" };
            _productServiceMock.Setup(service => service.CreateProduct(It.IsAny<ProductDTO>())).ReturnsAsync(productDto);

            // Act
            var result = await _productController.CreateProduct(productDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<ProductDTO>(createdAtActionResult.Value);
            Assert.Equal("NewProduct", returnValue.Name);
            Assert.Equal("NewDescription", returnValue.Description);
        }

        [Fact]
        public async Task UpdateProduct_ShouldReturnOkResult_WithUpdatedProductDTO()
        {
            // Arrange
            var productDto = new ProductDTO { Id = 1, Name = "UpdatedProduct", Description = "UpdatedDescription", Price = 50, Category = "UpdatedCategory", ImageUrl = "UpdatedImageUrl", Details = "UpdatedDetails" };
            _productServiceMock.Setup(service => service.GetProductById(1)).ReturnsAsync(productDto);
            _productServiceMock.Setup(service => service.UpdateProduct(1, productDto)).ReturnsAsync(productDto);

            // Act
            var result = await _productController.UpdateProduct(1, productDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<ProductDTO>(okResult.Value);
            Assert.Equal("UpdatedProduct", returnValue.Name);
            Assert.Equal(50, returnValue.Price);
        }

        [Fact]
        public async Task DeleteProduct_ShouldReturnNoContent()
        {
            // Arrange
            var productDto = new ProductDTO { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" };
            _productServiceMock.Setup(service => service.GetProductById(1)).ReturnsAsync(productDto);
            _productServiceMock.Setup(service => service.DeleteProduct(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _productController.DeleteProduct(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
