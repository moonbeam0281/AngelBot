using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot
{
    public enum SlashScope {None, Global, Guild}
    public abstract class Command(params string[] names) : ICommand
    {
        public IReadOnlyCollection<string> Names { get; } = names?.Length > 0 ?
            Array.AsReadOnly(names) :
            Array.AsReadOnly(["any"]);
        public virtual SlashScope Scope => SlashScope.Guild;

        public abstract EmbedBuilder HelpString();

        public abstract Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args);

        public virtual Task Run(SocketSlashCommand interaction, DiscordSocketClient client) => interaction.RespondAsync("This command is not available as a slash command.");

        public virtual SlashCommandBuilder BuildSlash() => new();
    }
}
