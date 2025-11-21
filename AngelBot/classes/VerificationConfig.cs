namespace AngelBot.Classes
{
    public class VerificationConfig
    {
        public ulong GuildId { get; set; }
        public ulong? VerificationChannelId { get; set; }
        public ulong? VerificationRoleId { get; set; }
        public bool Enabled { get; set; } = true;
    }
}
