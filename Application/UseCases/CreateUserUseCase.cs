using Application.DTOs;
using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.UseCases
{
    public class CreateUserUseCase
    {
        private readonly IUserRepository _repository;

        public CreateUserUseCase(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<CreateUserResponse> ExecuteAsync(CreateUserRequest request)
        {
            // 🔥 Aici poți pune validări, reguli business etc.
            await _repository.CreateAsync(request);

            return new CreateUserResponse
            {
                Message = $"Salut {request.FirstName} {request.LastName}!"
            };
        }
    }
}
