using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Repositories.Implementations;
using MadWorldInkWebAPI.Services.Interfaces;

namespace MadWorldInkWebAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepo _productRepo;
        private readonly IMapper _mapper;
        public ProductService(IProductRepo productRepo, IMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            return await _productRepo.GetProducts();
        }

        public async Task<ProductDTO> GetProductById(int id)
        {
            return await _productRepo.GetProductById(id);
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategory(string category)
        {
            return await _productRepo.GetProductsByCategory(category);
        }

        public async Task<ProductDTO> CreateProduct(ProductDTO productDto)
        {
            return await _productRepo.CreateProduct(productDto);
        }

        public async Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto)
        {
            return await _productRepo.UpdateProduct(id, productDto);
        }

        public async Task DeleteProduct(int id)
        {
            await _productRepo.DeleteProduct(id);
        }
    }
}
