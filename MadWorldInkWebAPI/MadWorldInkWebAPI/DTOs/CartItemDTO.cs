namespace MadWorldInkWebAPI.DTOs
{
    public class CartItemDTO
    {
        public int ItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public decimal TotalPrice { get; set; } // Price * Quantity
    }
}
