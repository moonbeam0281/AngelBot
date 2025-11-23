
using System.Text.Json.Serialization;

namespace AngelBot.Classes
{
    public class DashboardUser
    {
        public required string Id { get; init; }
        public required string Username { get; init; }
        public string Discriminator { get; init; } = "0";
        public string? Avatar { get; init; }
        public IEnumerable<CommonGuild> CommonGuilds {get; set;} = [];
    }

    public class CommonGuild
    {
        public required string GuildName {get; set;}
        public required string GuildId { get; set; }
        public required string? GuildAvatar {get; set;}
        public required string? GuildBanner {get; set;}
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public GuildPermission Permission { get; set; } = GuildPermission.CommonUser;
        
    }

    public enum GuildPermission {CommonUser, AdminPermissions, Owner}
}
