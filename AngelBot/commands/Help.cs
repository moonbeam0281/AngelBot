using System;
using System.Linq;
using System.Threading.Tasks;
using AngelBot.Classes;
using AngelBot.Handlers;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Help : Command
    {
        public Help() : base("help", "commands") { }

        private readonly string[] hiddenCommands = [ "any" ];

        public override SlashScope Scope => SlashScope.Global;

        public override EmbedBuilder HelpString()
            => new()
            {
                Title = GetType().Name,
                Description = "Command list and usage!",
                Color = new Color(204, 204, 255),
                Fields =
                [
                    new EmbedFieldBuilder {
                        Name = "I display all my available commands and slash commands!",
                        Value = "```a!help```"
                    }
                ]
            };

        private async Task SendHelpEmbeds(IMessageChannel channel, SocketUser author, DiscordSocketClient client)
        {
            var commandList = DiscordEventHadnler.CommandList
                .Cast<Command>()
                .Where(x => !hiddenCommands.Any(y => x.Names.Contains(y)))
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
                    var last3 = x.Names.Skip(Math.Max(0, x.Names.Count - 3));
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

        public override SlashCommandBuilder BuildSlash()
            => new()
            {
                Name = GetType().Name.ToLowerInvariant(),
                Description = "Command list and usage!"
            };

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            await interaction.RespondAsync("Listing my commands!", ephemeral: false);

            var channel = (IMessageChannel)interaction.Channel;
            await SendHelpEmbeds(channel, interaction.User, client);
        }
    }
}
