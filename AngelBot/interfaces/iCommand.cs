using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    interface ICommand
    {
        void Run(SocketMessage message, DiscordSocketClient client, string prefix);
    }
}