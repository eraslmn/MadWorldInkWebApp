using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MadWorldInkWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<ProductController> _logger;

        public ProductController(
            IProductService productService,
            IMapper mapper,
            IWebHostEnvironment webHostEnvironment,
            ILogger<ProductController> logger)
        {
            _productService = productService;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetProducts();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving products: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductById(int id)
        {
            try
            {
                var product = await _productService.GetProductById(id);
                if (product == null)
                {
                    return NotFound();
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving product {id}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct([FromForm] ProductDTO productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (productDto.Image != null)
                {
                    string uniqueFileName = UploadedFile(productDto);
                    productDto.ImageUrl = $"{Request.Scheme}://{Request.Host}{uniqueFileName}";
                }

                var createdProduct = await _productService.CreateProduct(productDto);

                return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating product: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDTO productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest("Product ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingProduct = await _productService.GetProductById(id);
                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Retain the existing ImageUrl if no new image is provided
                if (productDto.Image == null)
                {
                    productDto.ImageUrl = existingProduct.ImageUrl;
                }
                else
                {
                    string uniqueFileName = UploadedFile(productDto);
                    productDto.ImageUrl = $"{Request.Scheme}://{Request.Host}{uniqueFileName}";
                }

                var updatedProduct = await _productService.UpdateProduct(id, productDto);

                if (updatedProduct == null)
                {
                    return NotFound();
                }

                return Ok(updatedProduct);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating product {id}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }



        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductById(id);
                if (product == null)
                {
                    return NotFound();
                }

                await _productService.DeleteProduct(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting product {id}: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        private string UploadedFile(ProductDTO productDto)
        {
            string uniqueFileName = null;

            if (productDto.Image != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(productDto.Image.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    productDto.Image.CopyTo(fileStream);
                }

                return $"/images/{uniqueFileName}";
            }

            return uniqueFileName;
        }
    }
}