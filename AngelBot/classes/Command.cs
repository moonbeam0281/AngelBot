using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Classes
{
    public abstract class Command(CommandInfo info) : ICommand
    {
        public CommandInfo Info { get; } = info;

        public virtual EmbedBuilder HelpString()
        {
            var eb = new EmbedBuilder()
            {
                Title = Info.Name,
                Description = Info.Description,
                Color = Info.Color
            };
            if (Info.UsageExamples.Length > 0)
            {
                eb.AddField("Examples", $"``{string.Join("\n", Info.UsageExamples)}``");
            }
            else
            {
                eb.AddField("No examples", "There are no usage examples specified.");
            }

            return eb;
        }
        public virtual SlashCommandBuilder BuildSlash()
        {
            var builder = new SlashCommandBuilder()
            {
                Name = Info.Name.ToLowerInvariant(),
                Description = Info.Description?? "No description provided."
            };

            return builder;
        }

        public abstract Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args);

        public abstract Task Run(SocketSlashCommand interaction, DiscordSocketClient client);
    }
}
