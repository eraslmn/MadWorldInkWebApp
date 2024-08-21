using MadWorldInkWebAPI.DTOs;

namespace MadWorldInkWebAPI.Services.Interfaces
{
    public interface IProductService
    {

        Task<IEnumerable<ProductDTO>> GetProducts();
        Task<ProductDTO> GetProductById(int id);
        Task<IEnumerable<ProductDTO>> GetProductsByCategory(string category);
        Task<ProductDTO> CreateProduct(ProductDTO productDto);
        Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto);
        Task DeleteProduct(int id);
    }
}
