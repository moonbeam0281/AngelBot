using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class OutputLog : Command
    {
        public OutputLog() : base(new CommandInfo
        {
            Name = "outputLog",
            Description = "Displays the recent console logs from the backend",
            Aliases = ["output", "log"],
            Color = new Color(209, 69, 209),
            Scope = SlashScope.None,
            Category = CommandCategory.Developer,
            UsageExamples = ["a!output", "a!log", "angel log", "angel output"],
            UsageScopes = [UsageScope.Owner, UsageScope.Developer]
        })
        { }

        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            var logList = new ListingBuilder<LogMessage>(DiscordEventHandler.OutputLog, (range, i) =>
            {
                var e = new EmbedBuilder
                {
                    Title = "Backend Console logs",
                    Description = "Displaying the recent console messages from the bot:",
                    Color = Info.Color
                };
                foreach (var l in range)
                {
                    e.AddField($"{l.Severity}", $"```{l.Message}```");
                }

                return e.Build();
            }, disp:12, allowedUserId: message.Author.Id);

            await logList.SendAsync(message.Channel);
        }

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            //No slash implementation
        }
    }
}