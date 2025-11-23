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
            Color = new Color(255, 255, 128),
            Scope = SlashScope.Global,
            Category = CommandCategory.Information,
            UsageExamples = ["a!help", "a!help <command name>", "/help <command name>"]
        })
        { }

        private async Task SendHelpEmbeds(IMessageChannel channel, SocketUser author, DiscordSocketClient client)
        {
            var commandList = DiscordEventHandler.CommandList
                .Cast<Command>()
                .Where(x => x.Info.VisibleInHelp).ToList();

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

        private async Task SendSingleCommandHelp(IMessageChannel channel, Command cmd, DiscordSocketClient client, SocketUser user)
        {
            var embed = BuildSingleHelpEmbed(cmd, client, user);
            await channel.SendMessageAsync(embed: embed);
        }

        private Embed BuildSingleHelpEmbed(Command cmd, DiscordSocketClient client, SocketUser user)
        {
            var info = cmd.Info;

            var e = new EmbedBuilder
            {
                Title = $"Command: {info.Name}",
                Color = new Color(255, 179, 255),
                ThumbnailUrl = client.CurrentUser.GetAvatarUrl(),
                Timestamp = DateTime.UtcNow,
                Footer = new EmbedFooterBuilder
                {
                    Text = $"Requested by {user.Username}",
                    IconUrl = user.GetAvatarUrl()
                }
            };

            // Description
            e.AddField("Description", info.Description);

            // Aliases
            var aliasList = $"`{string.Join("`, `", info.Aliases)}`";
            e.AddField("Aliases", aliasList, false);

            // Usage
            var usage = string.Join("\n", info.UsageExamples.Select(u => $"• `{u}`"));
            e.AddField("Usage Examples", usage, false);

            // Category
            e.AddField("Category", info.Category.ToString(), true);

            // Scope
            e.AddField("Slash Scope", info.Scope.ToString(), true);

            return e.Build();
        }


        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            if (args.Length > 0)
            {
                var query = args[0].ToLower();

                var cmd = DiscordEventHandler.CommandList
                    .Cast<Command>()
                    .FirstOrDefault(c =>
                        c.Info.Name.Equals(query, StringComparison.CurrentCultureIgnoreCase) ||
                        c.Info.Aliases.Any(a => a.Equals(query, StringComparison.CurrentCultureIgnoreCase)));

                if (cmd == null)
                {
                    await message.Channel.SendMessageAsync($"❌ Command **{query}** not found.");
                    return;
                }

                await SendSingleCommandHelp(message.Channel, cmd, client, message.Author);
                return;
            }

            // Otherwise show full list
            await message.Channel.SendMessageAsync("Listing my commands!");
            await SendHelpEmbeds(message.Channel, message.Author, client);
        }

        public override SlashCommandBuilder BuildSlash()
        {
            var builder = base.BuildSlash();

            builder.AddOption(
                name: "command",
                type: ApplicationCommandOptionType.String,
                description: "Show detailed info for a specific command",
                isRequired: false,
                isAutocomplete: true
            );

            return builder;
        }

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            var query = interaction.Data.Options.FirstOrDefault()?.Value?.ToString()?.ToLower();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var cmd = DiscordEventHandler.CommandList
                    .Cast<Command>()
                    .FirstOrDefault(c =>
                        c.Info.Name.Equals(query, StringComparison.CurrentCultureIgnoreCase) ||
                        c.Info.Aliases.Any(a => a.Equals(query, StringComparison.CurrentCultureIgnoreCase)));

                if (cmd == null)
                {
                    await interaction.RespondAsync($"❌ Command **{query}** not found.", ephemeral: true);
                    return;
                }

                await interaction.RespondAsync(embed: BuildSingleHelpEmbed(cmd, client, interaction.User), ephemeral: true);
                return;
            }

            await interaction.RespondAsync("Listing my commands!", ephemeral: false);
            await SendHelpEmbeds(interaction.Channel, interaction.User, client);
        }

    }
}
