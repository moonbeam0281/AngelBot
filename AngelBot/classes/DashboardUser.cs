namespace AngelBot.Classes
{
    public class DashboardUser
    {
        public required string Id { get; init; }
        public required string Username { get; init; }
        public string Discriminator { get; init; } = "0";
        public string? Avatar { get; init; }
    }
}
