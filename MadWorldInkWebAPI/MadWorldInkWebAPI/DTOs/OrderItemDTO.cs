namespace MadWorldInkWebAPI.DTOs
{
    public class OrderItemDTO
    {
        public int ItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Unit price of the product
      
    }
}
