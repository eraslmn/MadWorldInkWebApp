using System.ComponentModel.DataAnnotations;

namespace MadWorldInkWebAPI.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Store the price of the product at the time of adding to the cart
        public decimal TotalPrice { get; set; } // Calculated as Price * Quantity
        public int CartId { get; set; }

        public Cart Cart { get; set; }
    }
}
