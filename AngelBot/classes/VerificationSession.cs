namespace AngelBot.Classes
{
    public class VerificationSession
    {
        public string Token { get; init; } = string.Empty;
        public ulong GuildId { get; init; }
        public ulong UserId { get; init; }
        public ulong? ChannelId { get; init; }
        public ulong? RoleId { get; init; }
        public DateTimeOffset CreatedAt { get; init; }
        public DateTimeOffset ExpiresAt { get; init; }

        public bool IsExpired => DateTimeOffset.UtcNow >= ExpiresAt;
    }

}