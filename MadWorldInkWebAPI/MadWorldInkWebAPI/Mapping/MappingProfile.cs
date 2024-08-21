using AutoMapper;
using MadWorldInkWebAPI.DTOs;
using MadWorldInkWebAPI.Models;

namespace MadWorldInkWebAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDTO>();
            CreateMap<ProductDTO, Product>();
            CreateMap<CartItem, CartItemDTO>()
    .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
    .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price)) // Map the product price
    .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Quantity * src.Product.Price)); // Calculate TotalPrice

            CreateMap<CartItemDTO, CartItem>();

            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.CartId, opt => opt.MapFrom(src => src.Id)) // Map CartId
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

            CreateMap<CartDTO, Cart>();

            CreateMap<OrderItem, OrderItemDTO>()
           .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
           .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.Id));
            CreateMap<OrderItemDTO, OrderItem>();

            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
            CreateMap<OrderDTO, Order>();
            CreateMap<User, UserDTO>(); // Add this line to map User to UserDTO
        }


    }
}
