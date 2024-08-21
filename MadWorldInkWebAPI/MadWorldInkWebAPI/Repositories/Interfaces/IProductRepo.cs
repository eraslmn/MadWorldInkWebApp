using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;

namespace MadWorldInkWebAPI.Repositories.Implementations
{
    public interface IProductRepo
    {

        Task<IEnumerable<ProductDTO>> GetProducts();
        Task<ProductDTO> GetProductById(int id);
        Task<IEnumerable<ProductDTO>> GetProductsByCategory(string category);
        Task<ProductDTO> CreateProduct(ProductDTO productDto);
        Task<ProductDTO> UpdateProduct(int id, ProductDTO productDto);
        Task DeleteProduct(int id);
    }
}
