﻿using System.Collections.Generic;
using System.Threading.Tasks;
using MadWorldInkWebAPI.DTOs;

namespace MadWorldInkWebAPI.Repositories.Interfaces
{
    public interface IOrderRepo
    {
        Task<IEnumerable<OrderDTO>> GetOrders();
        Task<OrderDTO> GetOrderById(int id);
        Task<OrderDTO> CreateOrder(OrderDTO orderDto);
        Task<OrderDTO> UpdateOrder(int id, OrderDTO orderDto);
        Task DeleteOrder(int id);

        Task<IEnumerable<OrderDTO>> GetOrdersByUserId(int userId);
    }
}
