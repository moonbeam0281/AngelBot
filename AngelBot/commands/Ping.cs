using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Ping : Command
    {
        public Ping() : base("ping", "pong")
        {

        }

        public override SlashScope Scope => SlashScope.Global;

        public override EmbedBuilder HelpString()
            => new()
            {
                Title = GetType().Name,
                Description = "Ping Pong latency!",
                Color = new Color(255, 255, 128),
                Fields =
                [
                    new EmbedFieldBuilder{Name = "I will display my ping latency!", Value = "```a!ping/pong```"}
                ]
            };

        public override Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            var pingpong = usedCommandName[1] == 'i' ? 'o' : 'i';
            message.Channel.SendMessageAsync($":ping_pong: P{pingpong}ng! : **{client.Latency}**ms");

            return Task.CompletedTask;
        }

        public override SlashCommandBuilder BuildSlash()
            => new()
            {
                Name = GetType().Name.ToLowerInvariant(),
                Description = "Ping pong latency!"
            };

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            var pingpong = interaction.CommandName[1] == 'i' ? 'o' : 'i';
            await interaction.RespondAsync($":ping_pong: P{pingpong}ng! : **{client.Latency}**ms");
        }
    }
}