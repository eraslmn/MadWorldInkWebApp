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
   
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
       
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _orderService.GetOrders();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [AllowAnonymous] // Allow anonymous access to view order details
        public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderById(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder([FromBody] OrderDTO orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdOrder = await _orderService.CreateOrder(orderDto);
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.OrderId }, createdOrder);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDTO orderDto)
        {
            if (id != orderDto.OrderId) // Use OrderId
            {
                return BadRequest("Order ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedOrder = await _orderService.UpdateOrder(id, orderDto);
            if (updatedOrder == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrdersByUserId(int userId)
        {
            var orders = await _orderService.GetOrdersByUserId(userId);
            if (orders == null)
            {
                return NotFound();
            }
            return Ok(orders);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _orderService.GetOrderById(id);
            if (order == null)
            {
                return NotFound();
            }

            await _orderService.DeleteOrder(id);
            return NoContent();
        }
    }
}