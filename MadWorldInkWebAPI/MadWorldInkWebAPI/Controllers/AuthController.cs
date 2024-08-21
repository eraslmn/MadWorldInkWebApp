using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;
using MadWorldInkWebAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace MadWorldInkWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Apply authorization at the controller level
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDTO registrationRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                UserName = registrationRequest.Username,
                Email = registrationRequest.Email
            };

            var result = await _userManager.CreateAsync(user, registrationRequest.Password);

            if (!result.Succeeded)
            {
                // Collect and return the specific errors
                var errors = result.Errors.Select(e => new { e.Code, e.Description }).ToList();

                if (errors.Any(e => e.Code == "DuplicateUserName"))
                {
                    return BadRequest(new { message = "This username is already taken." });
                }
                if (errors.Any(e => e.Code == "DuplicateEmail"))
                {
                    return BadRequest(new { message = "This email is already registered." });
                }
                if (errors.Any(e => e.Code == "PasswordTooShort"))
                {
                    return BadRequest(new { message = "Password must be at least 6 characters long." });
                }

                // Return all errors if specific cases are not handled
                return BadRequest(errors);
            }

            await _userManager.AddToRoleAsync(user, "Client");

            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginRequest.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginRequest.Password, false, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = await _tokenService.CreateToken(user);

            return Ok(new AuthResponseDTO { Token = token });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDTO
            {
                Id = user.Id, // Ensure this line is present to map the id
                Username = user.UserName,
                Email = user.Email
            };

            return Ok(userDto);
        }

        // New endpoint to get all users
        [HttpGet("all")]
        [Authorize(Roles = "Admin")] // Ensure that only admin users can access order endpoints
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = _userManager.Users.ToList();
            var userDtos = users.Select(user => new UserDTO
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email
            }).ToList();

            return Ok(userDtos);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Restrict this operation to Admins
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Failed to delete user.");
            }

            return NoContent();
        }

        [HttpGet("getUser")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDTO
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email
            };

            return Ok(userDto);
        }
    }

}
