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

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SlashScope Scope { get; init; } = SlashScope.Global;

        // Category (e.g. Fun, Admin, Utility)
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CommandCategory Category { get; init; }

        // Usage examples
        public string[] UsageExamples { get; init; } = [];

        // Whether to show in help command
        public bool VisibleInHelp { get; init; } = true;
        //Usage scope for users
        public UsageScope[] UsageScopes { get; set; } = [UsageScope.CommonUser];
    }

    public enum SlashScope { None, Global, Guild }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UsageScope { Owner, Admin, Developer, CommonUser }

    public enum CommandCategory { General, Utility, Fun, Moderation, Music, Security, Information, Developer }
}
