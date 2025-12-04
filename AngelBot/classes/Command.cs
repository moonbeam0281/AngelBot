using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;
using AngelBot.Database.Repositories;
using System.Threading.Tasks;

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

        public virtual Task<bool> IsSlashAvailableAsync(ulong guildId)
            => Task.FromResult(false);

        public virtual SlashCommandBuilder BuildSlash()
        {
            var builder = new SlashCommandBuilder()
            {
                Name = Info.Name.ToLowerInvariant(),
                Description = Info.Description ?? "No description provided."
            };

            return builder;
        }

        public virtual bool IsAdminOrGuildOwner(SocketGuildUser user, SocketGuild guild)
            => user.Id == guild.OwnerId || user.GuildPermissions.Administrator;

        public virtual bool IsBotOwner(string userId)
            => userId == Environment.GetEnvironmentVariable("OWNER_ID");
        public virtual async Task<bool> IsDeveloperAsync(ulong userId)
            => await DeveloperRepo.Instance.IsDeveloperAsync(userId);

        public virtual async Task<bool> HasPermissionAsync(SocketMessage message, DiscordSocketClient client)
        {
            var scopes = Info.UsageScopes ?? [];
            if (scopes.Length == 0) return true;

            var user = message.Author;

            // OWNER
            if (scopes.Contains(UsageScope.Owner) && IsBotOwner(user.Id.ToString()))
                return true;

            // DEVELOPER
            if (scopes.Contains(UsageScope.Developer) && await IsDeveloperAsync(user.Id))
                return true;

            // ADMIN (guild)
            if (message.Channel is SocketGuildChannel gChannel &&
                user is SocketGuildUser gUser &&
                scopes.Contains(UsageScope.Admin))
            {
                if (IsAdminOrGuildOwner(gUser, gChannel.Guild))
                    return true;
            }

            // COMMON USER
            if (scopes.Contains(UsageScope.CommonUser))
                return true;

            return false;
        }

        public virtual async Task<bool> HasPermissionAsync(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            var scopes = Info.UsageScopes ?? Array.Empty<UsageScope>();
            if (scopes.Length == 0) return true;

            var user = interaction.User;

            // OWNER
            if (scopes.Contains(UsageScope.Owner) && IsBotOwner(user.Id.ToString()))
                return true;

            // DEVELOPER
            if (scopes.Contains(UsageScope.Developer) && await IsDeveloperAsync(user.Id))
                return true;

            // ADMIN
            if (interaction.GuildId.HasValue && scopes.Contains(UsageScope.Admin))
            {
                var guild = client.GetGuild(interaction.GuildId.Value);
                var gUser = guild?.GetUser(user.Id);

                if (guild != null && gUser != null && IsAdminOrGuildOwner(gUser, guild))
                    return true;
            }

            // COMMON USER
            if (scopes.Contains(UsageScope.CommonUser))
                return true;

            return false;
        }


        public abstract Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args);

        public abstract Task Run(SocketSlashCommand interaction, DiscordSocketClient client);
    }
}
