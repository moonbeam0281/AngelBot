using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Help : Command
    {
        public Help() : base(new CommandInfo
        {
            Name = "help",
            Description = "I list all my commands and usages!",
            Aliases = ["help"],
            Color = new Color(255,255,128),
            Scope = SlashScope.Global,
            Category = CommandCategory.Information,
            UsageExamples = ["a!help", "a!help <command name>", "/help <command name>"]
        }) { }

        private readonly string[] hiddenCommands = [ "any" ];

        private async Task SendHelpEmbeds(IMessageChannel channel, SocketUser author, DiscordSocketClient client)
        {
            var commandList = DiscordEventHadnler.CommandList
                .Cast<Command>()
                .Where(x => !hiddenCommands.Any(y => x.Info.Aliases.Contains(y)))
                .ToList();

            var listingBuild = new ListingBuilder<Command>(commandList, (range, info) =>
            {
                var e = new EmbedBuilder
                {
                    Title = "AngelBot Help commands",
                    Description = "These are all my commands that I have! Feel free to look around!",
                    ThumbnailUrl = client.CurrentUser.GetAvatarUrl(),
                    Footer = new EmbedFooterBuilder
                    {
                        Text = $"Displaying List #{info.Current}: {info.Min} - {info.Max} | {info.List.Count()}",
                        IconUrl = author.GetAvatarUrl()
                    },
                    Timestamp = DateTime.UtcNow,
                    Color = new Color(255, 179, 255)
                };

                foreach (var x in range)
                {
                    var last3 = x.Info.Aliases.Skip(Math.Max(0, x.Info.Aliases.Length - 3));
                    var temp = $"[`{string.Join(",", last3)}`]";
                    var help = x.HelpString();
                    e.AddField($"**{help.Title}**", $"{temp}\n{help.Description}");
                }

                return e.Build();
            }, disp: 7, allowedUserId: author.Id);
            await listingBuild.SendAsync((ISocketMessageChannel)channel);
        }

        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            await message.Channel.SendMessageAsync("Listing my commands!");
            await SendHelpEmbeds(message.Channel, message.Author, client);
            await Task.CompletedTask;
        }

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            await interaction.RespondAsync("Listing my commands!", ephemeral: false);

            var channel = (IMessageChannel)interaction.Channel;
            await SendHelpEmbeds(channel, interaction.User, client);
        }
    }
}
