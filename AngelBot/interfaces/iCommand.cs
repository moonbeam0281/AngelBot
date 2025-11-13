using Discord;
using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    public interface ICommand
    {
        CommandInfo Info { get; }

        EmbedBuilder HelpString();
        SlashCommandBuilder BuildSlash();

        Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args);

        Task Run(SocketSlashCommand interaction, DiscordSocketClient client);

    }
}