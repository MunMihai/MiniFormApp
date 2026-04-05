using Application.DTOs;
using Application.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly CreateUserUseCase _createUseCase;
        private readonly GetUsersUseCase _getUsersUseCase;

        public UserController(CreateUserUseCase createUseCase, GetUsersUseCase getUsersUseCase)
        {
            _createUseCase = createUseCase;
            _getUsersUseCase = getUsersUseCase;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserRequest request)
        {
            var result = await _createUseCase.ExecuteAsync(request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _getUsersUseCase.ExecuteAsync();
            return Ok(users);
        }
    }
}
