namespace MadWorldInkWebAPI.DTOs
{
    public class CartDTO
    {
        public int CartId { get; set; } //??
        public int UserId { get; set; }
        public List<CartItemDTO> Items { get; set; }
    }
}
