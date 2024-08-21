namespace MadWorldInkWebAPI.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public IFormFile Image { get; set; } // Image file
        public string Category { get; set; }
        public string Details { get; set; }
        public string ImageUrl { get; set; } // URL to the uploaded image
    }
}
