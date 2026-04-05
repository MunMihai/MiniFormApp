using Application.Interfaces;
using Application.UseCases;
using Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// 🔥 Repository
builder.Services.AddSingleton<IUserRepository, UserRepository>();

// 🔥 UseCases
builder.Services.AddScoped<CreateUserUseCase>();
builder.Services.AddScoped<GetUsersUseCase>();

// 🔥 CORS
var allowedOrigins = builder.Configuration["AllowedOrigins"]?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🔥 CORS primul - inainte de orice alt middleware
app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();