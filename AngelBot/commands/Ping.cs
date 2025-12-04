using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Ping : Command
    {
        public Ping() : base(new CommandInfo
        {
            Name = "ping",
            Description = "Ping pong with the latency!",
            Aliases = ["ping", "pong"],
            Color = new Color(255,255,128),
            Scope = SlashScope.None,
            Category = CommandCategory.Developer,
            UsageExamples = ["a!ping", "angel ping", "/ping"],
            UsageScopes = [UsageScope.Owner, UsageScope.Developer]
        }){ }

        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            var pingpong = usedCommandName[1] == 'i' ? 'o' : 'i';
            await message.Channel.SendMessageAsync($":ping_pong: P{pingpong}ng! : **{client.Latency}**ms");
        }

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            var pingpong = interaction.CommandName[1] == 'i' ? 'o' : 'i';
            await interaction.RespondAsync($":ping_pong: P{pingpong}ng! : **{client.Latency}**ms");
        }
    }
}