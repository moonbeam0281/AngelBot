using Discord;
using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    interface ICommand
    {
        IReadOnlyCollection<string> Names { get; }
        Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args);

        Task Run(SocketSlashCommand interaction, DiscordSocketClient client);

        SlashCommandBuilder BuildSlash();
    }
}