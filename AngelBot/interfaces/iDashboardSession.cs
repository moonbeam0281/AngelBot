
namespace AngelBot.Interfaces
{
    public interface iDashboardSession
    {
        string Id { get; }
        string UserId { get; }
        string Username { get; }
        string Discriminator { get; }
        string AvatarHash { get; }
        DateTime CreatedAt { get; }
        DateTime LastActiveAt { get; set; }
    }

}
