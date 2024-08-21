using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories;
using MadWorldInkWebAPI.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MadWorldInkWebAPI.Test.Repositories
{
    public class ProductRepoTest
    {
        private DbContextOptions<AppDbContext> CreateNewContextOptions()
        {
            return new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDatabase_{Guid.NewGuid()}")
                .Options;
        }

        [Fact]
        public async Task GetProducts_ShouldReturnListOfProductDTOs()
        {
            // Arrange
            var options = CreateNewContextOptions();
            using (var context = new AppDbContext(options))
            {
                context.Products.AddRange(new List<Product>
                {
                    new Product { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" },
                    new Product { Id = 2, Name = "Product2", Description = "Description2", Price = 20, Category = "Category2", ImageUrl = "ImageUrl2", Details = "Details2" }
                });
                await context.SaveChangesAsync();
            }

            using (var context = new AppDbContext(options))
            {
                var productRepo = new ProductRepo(context);

                // Act
                var result = await productRepo.GetProducts();

                // Assert
                Assert.NotNull(result);
                Assert.Equal(2, result.Count());
                Assert.Equal("Product1", result.First().Name);
            }
        }

        [Fact]
        public async Task GetProductById_ShouldReturnProductDTO()
        {
            // Arrange
            var options = CreateNewContextOptions();
            using (var context = new AppDbContext(options))
            {
                var product = new Product { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" };
                context.Products.Add(product);
                await context.SaveChangesAsync();
            }

            using (var context = new AppDbContext(options))
            {
                var productRepo = new ProductRepo(context);

                // Act
                var result = await productRepo.GetProductById(1);

                // Assert
                Assert.NotNull(result);
                Assert.Equal("Product1", result.Name);
            }
        }

        [Fact]
        public async Task GetProductsByCategory_ShouldReturnProductsOfSpecificCategory()
        {
            // Arrange
            var options = CreateNewContextOptions();
            using (var context = new AppDbContext(options))
            {
                context.Products.AddRange(new List<Product>
                {
                    new Product { Id = 1, Name = "Product1", Description = "Description1", Price = 10, Category = "Category1", ImageUrl = "ImageUrl1", Details = "Details1" },
                    new Product { Id = 2, Name = "Product2", Description = "Description2", Price = 20, Category = "Category1", ImageUrl = "ImageUrl2", Details = "Details2" }
                });
                await context.SaveChangesAsync();
            }

            using (var context = new AppDbContext(options))
            {
                var productRepo = new ProductRepo(context);

                // Act
                var result = await productRepo.GetProductsByCategory("Category1");

                // Assert
                Assert.NotNull(result);
                Assert.Equal(2, result.Count());
                Assert.All(result, p => Assert.Equal("Category1", p.Category));
            }
        }

        [Fact]
        public async Task CreateProduct_ShouldAddProductAndReturnProductDTO()
        {
            // Arrange
            var options = CreateNewContextOptions();
            using (var context = new AppDbContext(options))
            {
                var productDto = new ProductDTO { Name = "NewProduct", Description = "NewDescription", Price = 30, Category = "NewCategory", ImageUrl = "NewImageUrl", Details = "NewDetails" };

                var productRepo = new ProductRepo(context);

                // Act
                var result = await productRepo.CreateProduct(productDto);

                // Assert
                Assert.NotNull(result);
                Assert.NotEqual(0, result.Id);  // Check that Id is set
                Assert.Equal("NewProduct", result.Name);
            }
        }

        [Fact]
        public async Task UpdateProduct_ShouldModifyExistingProductAndReturnProductDTO()
        {
            // Arrange
            var options = CreateNewContextOptions();
            using (var context = new AppDbContext(options))
            {
                var product = new Product { Id = 1, Name = "OldProduct", Description = "OldDescription", Price = 30, Category = "OldCategory", ImageUrl = "OldImageUrl", Details = "OldDetails" };
                context.Products.Add(product);
                await context.SaveChangesAsync();
            }

            using (var context = new AppDbContext(options))
            {
                var productDto = new ProductDTO { Id = 1, Name = "UpdatedProduct", Description = "UpdatedDescription", Price = 50, Category = "UpdatedCategory", ImageUrl = "UpdatedImageUrl", Details = "UpdatedDetails" };

                var productRepo = new ProductRepo(context);

                // Act
                var result = await productRepo.UpdateProduct(1, productDto);

                // Assert
                Assert.NotNull(result);
                Assert.Equal("UpdatedProduct", result.Name);
                Assert.Equal(50, result.Price);
            }
        }
    }
}
