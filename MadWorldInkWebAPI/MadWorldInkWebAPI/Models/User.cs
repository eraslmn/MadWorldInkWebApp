
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace MadWorldInkWebAPI.Models
{
    public class User : IdentityUser<int>
    {
        
        public ICollection<Cart> Carts { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
