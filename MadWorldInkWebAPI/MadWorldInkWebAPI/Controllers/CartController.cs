using System.Collections.Generic;
using System.Threading.Tasks;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MadWorldInkWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartDTO>>> GetCarts()
        {
            var carts = await _cartService.GetCarts();
            return Ok(carts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartDTO>> GetCartById(int id)
        {
            var cart = await _cartService.GetCartById(id);
            if (cart == null)
            {
                return NotFound();
            }
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult<CartDTO>> CreateCart([FromBody] CartDTO cartDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdCart = await _cartService.CreateCart(cartDto);
            return CreatedAtAction(nameof(GetCartById), new { id = createdCart.CartId }, createdCart);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCart(int id, [FromBody] CartDTO cartDto)
        {
            if (id != cartDto.CartId)
            {
                return BadRequest("Cart ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedCart = await _cartService.UpdateCart(id, cartDto);
            if (updatedCart == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            var cart = await _cartService.GetCartById(id);
            if (cart == null)
            {
                return NotFound();
            }

            await _cartService.DeleteCart(id);
            return NoContent();
        }

        [HttpPost("{cartId}/items")]
        public async Task<ActionResult<CartDTO>> AddProductToCart(int cartId, [FromBody] AddProductToCartDTO addProductDto)
        {
            var updatedCart = await _cartService.AddProductToCart(cartId, addProductDto.ProductId, addProductDto.Quantity);
            if (updatedCart == null)
            {
                return NotFound();
            }
            return Ok(updatedCart);
        }

        [HttpDelete("{cartId}/items/{itemId}")]
        public async Task<IActionResult> RemoveCartItem(int cartId, int itemId)
        {
            var cart = await _cartService.GetCartById(cartId);
            if (cart == null)
            {
                return NotFound();
            }

            var result = await _cartService.RemoveCartItem(cartId, itemId);
            if (!result)
            {
                return BadRequest("Could not remove cart item.");
            }

            return NoContent();
        }

        [HttpPatch("{cartId}/items/{itemId}")]
        public async Task<ActionResult<CartDTO>> UpdateCartItemQuantity(int cartId, int itemId, [FromBody] int quantity)
        {
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            var updatedCart = await _cartService.UpdateCartItemQuantity(cartId, itemId, quantity);
            if (updatedCart == null)
            {
                return NotFound("Cart or Item not found.");
            }

            return Ok(updatedCart);
        }
    }
}

