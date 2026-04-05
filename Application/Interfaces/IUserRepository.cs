using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface IUserRepository
    {
        Task CreateAsync(CreateUserRequest user);
        Task<List<UserDto>> GetAllAsync();
    }
}
