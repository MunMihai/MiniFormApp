using Application.DTOs;
using Application.Interfaces;

namespace Application.UseCases
{
    public class GetUsersUseCase
    {
        private readonly IUserRepository _repository;

        public GetUsersUseCase(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserDto>> ExecuteAsync()
        {
            return await _repository.GetAllAsync();
        }
    }
}
