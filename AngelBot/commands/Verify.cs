using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;
using Discord;
using AngelBot.Handlers;
using System.Linq;

namespace AngelBot.Commands
{
    class Verify : Command
    {
        public Verify() : base(new CommandInfo
        {
            Name = "verify",
            Description = "Verifies the user into the server",
            Aliases = ["verify"],
            Color = new Color(255, 255, 128),
            Scope = SlashScope.Guild,
            Category = CommandCategory.Security,
            UsageExamples = [
                "angel verify channel #verify-here",
                "angel verify role @Verified",
                "angel verify toggle",
                "/verify"
            ],
            UsageScopes = [UsageScope.Admin, UsageScope.CommonUser]
        })
        { }

        public override async Task<bool> IsSlashAvailableAsync(ulong guildId)
        {
            var cfg = await VerificationHandler.Instance.GetGuildConfigAsync(guildId);

            if (cfg is null) return false;
            if (!cfg.Enabled) return false;
            if (!cfg.VerificationChannelId.HasValue || !cfg.VerificationRoleId.HasValue) return false;

            return true;
        }

        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            if (message.Channel is not SocketGuildChannel guildChannel)
            {
                await message.Channel.SendMessageAsync("This command can only be used in a server.");
                return;
            }

            var guild = guildChannel.Guild;

            if (message.Author is not SocketGuildUser user)
            {
                await message.Channel.SendMessageAsync("Could not resolve user in this guild.");
                return;
            }

            // Only owner or admins can configure verification
            if (!IsAdminOrGuildOwner(user, guild))
            {
                await message.Channel.SendMessageAsync("Only the server owner or admins can configure verification.");
                return;
            }

            // No args -> show status
            if (args.Length == 0)
            {
                var cfg = await VerificationHandler.Instance.GetGuildConfigAsync(guild.Id);

                if (cfg == null)
                {
                    await message.Channel.SendMessageAsync(
                        "Verification is not configured yet.\n" +
                        "Use `angel verify channel` and `angel verify role` to set it up."
                    );
                    return;
                }

                var chText = cfg.VerificationChannelId.HasValue
                    ? $"<#{cfg.VerificationChannelId.Value}>"
                    : "`not set`";

                var roleText = cfg.VerificationRoleId.HasValue
                    ? $"<@&{cfg.VerificationRoleId.Value}>"
                    : "`not set`";

                var enabledText = cfg.Enabled ? "✅ Enabled" : "❌ Disabled";

                await message.Channel.SendMessageAsync(
                    $"**Verification settings for this server:**\n" +
                    $"- Channel: {chText}\n" +
                    $"- Role: {roleText}\n" +
                    $"- Status: {enabledText}\n\n" +
                    $"Commands:\n" +
                    $"`angel verify channel [#channel]` – set verification channel (default: current)\n" +
                    $"`angel verify role @Role` – set verification role\n" +
                    $"`angel verify toggle` – enable/disable verification"
                );
                return;
            }

            var sub = args[0].ToLower();

            switch (sub)
            {
                case "channel":
                    await HandleSetChannel(message, guild, client, guildChannel, args);
                    break;

                case "role":
                    await HandleSetRole(message, guild, client, args);
                    break;

                case "toggle":
                    await HandleToggle(message, guild, client);
                    break;

                default:
                    await message.Channel.SendMessageAsync(
                        "Unknown subcommand.\n" +
                        "Usage:\n" +
                        "`angel verify` – show current settings\n" +
                        "`angel verify channel [#channel]` – set verification channel\n" +
                        "`angel verify role @Role` – set verification role\n" +
                        "`angel verify toggle` – enable/disable verification"
                    );
                    break;
            }

        }

        private static bool ShouldHaveVerifySlash(VerificationConfig? cfg)
            => cfg is { Enabled: true } && cfg.VerificationChannelId.HasValue && cfg.VerificationRoleId.HasValue;

        private async Task HandleSetChannel(SocketMessage message, SocketGuild guild, DiscordSocketClient client, SocketGuildChannel currentChannel, string[] args)
        {
            var channel = currentChannel as SocketTextChannel;

            if (args.Length >= 2)
            {
                var raw = args[1];

                if (raw.StartsWith("<#") && raw.EndsWith(">"))
                    raw = raw[2..^1];

                if (!ulong.TryParse(raw, out var chId))
                {
                    await message.Channel.SendMessageAsync("Invalid channel ID or mention.");
                    return;
                }

                var found = guild.GetTextChannel(chId);
                if (found == null)
                {
                    await message.Channel.SendMessageAsync("Channel not found in this server.");
                    return;
                }

                channel = found;
            }

            if (channel == null)
            {
                await message.Channel.SendMessageAsync("Could not resolve a text channel.");
                return;
            }

            var existing = await VerificationHandler.Instance.GetGuildConfigAsync(guild.Id);
            await VerificationHandler.Instance.SetGuildConfigAsync(
                guild.Id,
                channel.Id,
                existing?.VerificationRoleId,
                existing?.Enabled ?? true
            );

            var shouldExist = ShouldHaveVerifySlash(existing);

            await DiscordEventHandler.UpdateSlashCommandAsync(client, this, guild, shouldExist);

            await message.Channel.SendMessageAsync($"Verification channel set to {channel.Mention}.");
        }

        private async Task HandleSetRole(SocketMessage message, SocketGuild guild, DiscordSocketClient client, string[] args)
        {
            if (args.Length < 2)
            {
                await message.Channel.SendMessageAsync("Please specify a role (ID or @Role).");
                return;
            }

            var raw = args[1];

            if (raw.StartsWith("<@&") && raw.EndsWith(">"))
                raw = raw[3..^1];

            if (!ulong.TryParse(raw, out var roleId))
            {
                await message.Channel.SendMessageAsync("Invalid role ID or mention.");
                return;
            }

            var role = guild.GetRole(roleId);
            if (role == null)
            {
                await message.Channel.SendMessageAsync("Role not found in this server.");
                return;
            }

            var existing = await VerificationHandler.Instance.GetGuildConfigAsync(guild.Id);
            await VerificationHandler.Instance.SetGuildConfigAsync(
                guild.Id,
                existing?.VerificationChannelId,
                role.Id,
                existing?.Enabled ?? true
            );

            var shouldExist = ShouldHaveVerifySlash(existing);

            await DiscordEventHandler.UpdateSlashCommandAsync(client, this, guild, shouldExist);

            await message.Channel.SendMessageAsync($"Verification role set to {role.Mention}.");
        }

        private async Task HandleToggle(SocketMessage message, SocketGuild guild, DiscordSocketClient client)
        {
            var existing = await VerificationHandler.Instance.GetGuildConfigAsync(guild.Id);

            bool newEnabled = !(existing?.Enabled ?? false);

            await VerificationHandler.Instance.SetGuildConfigAsync(
                guild.Id,
                existing?.VerificationChannelId,
                existing?.VerificationRoleId,
                newEnabled
            );

            var shouldExist = ShouldHaveVerifySlash(existing);

            await DiscordEventHandler.UpdateSlashCommandAsync(client, this, guild, shouldExist);

            await message.Channel.SendMessageAsync(
                $"Verification is now {(newEnabled ? "✅ **enabled**" : "❌ **disabled**")}."
            );
        }

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            var frontendPath = Environment.GetEnvironmentVariable("FRONT_END_PATH");

            if (string.IsNullOrWhiteSpace(frontendPath))
            {
                await interaction.RespondAsync("Verification is not configured yet.", ephemeral: true);
                return;
            }

            if (interaction.GuildId is null)
            {
                await interaction.RespondAsync("This command can only be used in a server.", ephemeral: true);
                return;
            }

            var cfg = await VerificationHandler.Instance.GetGuildConfigAsync(interaction.GuildId.Value);
            if (cfg == null || !cfg.Enabled || cfg.VerificationRoleId == null)
            {
                await interaction.RespondAsync(
                    "Verification is not properly configured in this server yet.\n" +
                    "Ask an admin to run `angel verify` to set up the channel and role.",
                    ephemeral: true
                );
                return;
            }

            if (cfg.VerificationChannelId != interaction.ChannelId)
            {
                await interaction.RespondAsync(
                    "This is not the right channel to use /verify on this server." +
                    $" The correct channel is <#{cfg.VerificationChannelId}>",
                    ephemeral: true
                );
                return;
            }

            if (interaction.User is not SocketGuildUser gUser)
            {
                await interaction.RespondAsync("Something went wrong resolving your user.", ephemeral: true);
                return;
            }

            if (cfg.VerificationRoleId.HasValue && gUser.Roles.Any(r => r.Id == cfg.VerificationRoleId.Value))
            {
                await interaction.RespondAsync(
                    "You are already verified in this server! 🎉",
                    ephemeral: true
                );
                return;
            }

            var session = await VerificationHandler.Instance.CreateSessionAsync(
                interaction.GuildId.Value,
                interaction.User.Id
            );

            var url = $"{frontendPath.TrimEnd('/')}/join/verify?guildId={interaction.GuildId}&token={session.Token}";

            await interaction.RespondAsync($"To verify, use this link: {url}", ephemeral: true);
        }
    }
}
