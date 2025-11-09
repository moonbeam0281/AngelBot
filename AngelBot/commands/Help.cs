using AngelBot.Classes;
using AngelBot.Handlers;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Help : Command
    {
        public Help() : base("help")
        {

        }

        private readonly string[] hiddenCommands =
        [
            "any"
        ];

        public override SlashScope Scope => SlashScope.Global;

        public override EmbedBuilder HelpString()
            => new()
            {
                Title = GetType().Name,
                Description = "Command list and usage!",
                Color = new Color(204, 204, 255),
                Fields =
                [
                    new EmbedFieldBuilder{Name = "I display all my available commands and slash commands!", Value = "```a!help```"}
                ]
            };

        private void getHelpEmbed(SocketMessage message, DiscordSocketClient client)
        {
            var commandList = DiscordEventHadnler.CommandList.Cast<Command>().Where(x => !hiddenCommands.Any(y => x.Names.Contains(y))).ToList();

            new ListingBuilder<Command>(commandList, (range, info) =>
            {
                var e = new EmbedBuilder()
                {
                    Title = "AngelBot Help commands",
                    Description = "These are all my commands that I have! Feel free to look around!",
                    ThumbnailUrl = client.CurrentUser.GetAvatarUrl(),
                    Footer = new EmbedFooterBuilder { Text = $"Displaying List #{info.Current}: {info.Min} - {info.Max} | {info.List.Count()}", IconUrl = message.Author.GetAvatarUrl() },
                    Timestamp = DateTime.UtcNow,
                    Color = new Color(255, 179, 255)
                };

                var list = range.ToList();
                foreach(var x in list)
                {
                    var temp = $"[`{(x.Names.Skip(x.Names.Count < 3 ? 0 : x.Names.Count - 3).Aggregate((i, j) => i + "," + j))}`]";
                    e.AddField($"**{x.HelpString().Title}**", $"{temp}\n{x.HelpString().Description}");
                }

                return e.Build();
            }, disp: 7).Send(message.Channel);
        }

        public override Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            message.Channel.SendMessageAsync($"Listing my commands!");
            getHelpEmbed(message, client);
            return Task.CompletedTask;
        }



        public override SlashCommandBuilder BuildSlash()
        => new()
        {
            Name = GetType().Name.ToLowerInvariant(),
            Description = "Command list and usage!"
        };

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            await interaction.RespondAsync($"Listing my commands!");
            getHelpEmbed((SocketMessage)interaction.Channel, client);
        }
    }
}