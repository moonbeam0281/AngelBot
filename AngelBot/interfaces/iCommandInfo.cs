using System.Text.Json.Serialization;
using Discord;

namespace AngelBot.Interfaces
{
    public class CommandInfo
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public string[] Aliases { get; init; } = [];
        public Color Color { get; init; } = new Color(255, 255, 255);
        public SlashScope Scope { get; init; } = SlashScope.Global;

        // Category (e.g. Fun, Admin, Utility)
        public CommandCategory Category { get; init; }

        // Usage examples
        public string[] UsageExamples { get; init; } = [];

        //Usage scope for users
        public UsageScope[] UsageScopes { get; set; } = [UsageScope.CommonUser];
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SlashScope { None, Global, Guild }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UsageScope { Owner, Admin, Developer, CommonUser }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CommandCategory { General, Utility, Fun, Moderation, Music, Security, Information, Developer }
}
