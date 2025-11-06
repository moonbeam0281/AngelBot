using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    interface IPreLoad
    {
        void PreLoad(DiscordSocketClient client);
    }
}
