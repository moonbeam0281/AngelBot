using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    interface ICommand
    {
        IReadOnlyCollection<string> Names { get; }
        Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string[] args);
    }
}