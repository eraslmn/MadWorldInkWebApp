using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.Data;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MadWorldInkWebAPI.Repositories
{
    public class ProductRepo : IProductRepo
    {
        private readonly AppDbContext _context;

        public ProductRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            return await _context.Products
                .Select(product => new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Category = product.Category,
                    ImageUrl = product.ImageUrl,
                    Details = product.Details
                })
                .ToListAsync();
        }

        public async Task<ProductDTO> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return null;
            }

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Category = product.Category,
                ImageUrl = product.ImageUrl,
                Details = product.Details
            };
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategory(string category)
        {
            return await _context.Products
                .Where(product => product.Category == category)
                .Select(product => new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Category = product.Category,
                    ImageUrl = product.ImageUrl,
                    Details = product.Details
                })
                .ToListAsync();
        }

        public async Task<ProductDTO> CreateProduct(ProductDTO productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Category = productDto.Category,
                ImageUrl = productDto.ImageUrl,
                Details = productDto.Details
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            productDto.Id = product.Id; // Get the generated ID

            return productDto;
        }

        public async Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return null;
            }

            product.Name = productDto.Name;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Category = productDto.Category;
            product.ImageUrl = productDto.ImageUrl;
            product.Details = productDto.Details;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return productDto;
        }

        public async Task DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
