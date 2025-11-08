using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot
{
    public abstract class Command(params string[] names) : ICommand
    {
        public IReadOnlyCollection<string> Names { get; } = names?.Length > 0 ?
            Array.AsReadOnly(names) :
            Array.AsReadOnly(["any"]);

        public abstract EmbedBuilder HelpString();

        public abstract Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string[] args);
    }
}
