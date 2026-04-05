namespace Application.DTOs;

public class CreateUserRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public string Sex { get; set; }
}