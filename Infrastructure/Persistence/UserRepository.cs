using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<UserDocument> _users;

        public UserRepository(IConfiguration config)
        {
            var connectionString = config["MongoSettings:ConnectionString"];
            var databaseName = config["MongoSettings:DatabaseName"];

            var settings = MongoClientSettings.FromConnectionString(connectionString);
            settings.SslSettings = new SslSettings
            {
                EnabledSslProtocols = System.Security.Authentication.SslProtocols.Tls12,
                AllowInsecureTls = true
            };
            var client = new MongoClient(settings);
            var database = client.GetDatabase(databaseName);

            _users = database.GetCollection<UserDocument>("Users");
        }

        public async Task CreateAsync(CreateUserRequest user)
        {
            var document = new UserDocument
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate,
                Sex = user.Sex
            };

            await _users.InsertOneAsync(document);
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var documents = await _users.Find(_ => true).ToListAsync();

            return documents.Select(d => new UserDto
            {
                Id = d.Id,
                FirstName = d.FirstName,
                LastName = d.LastName,
                BirthDate = d.BirthDate,
                Sex = d.Sex
            }).ToList();
        }
    }
}
