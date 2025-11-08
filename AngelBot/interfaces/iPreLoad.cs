using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    public interface IPreLoad
    {
        Task PreLoad(DiscordSocketClient client);
    }
}
