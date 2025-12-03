using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    public class DiscordEventHandler
    {
        private readonly DiscordSocketClient _mainClient;
        public readonly List<LogMessage> OutputLog = [];
        internal readonly object OutputLogLock = new();
        private CancellationTokenSource _cts = new();
        public static ICommand[] CommandList = [];
        private readonly List<string> basePrefixes =
        [
            "angel",
            "a!"
        ];

        public DiscordEventHandler(DiscordSocketClient client)
        {
            _mainClient = client;

            client.Log += Log;
            client.Ready += OnReady;

            client.MessageReceived += MessageReceived;
            client.SlashCommandExecuted += SlashCommandExecuted;

            client.ReactionAdded += ReactionAdded;

            client.AutocompleteExecuted += AutocompleteExecuted;


        }

        private async Task OnReady()
        {
            var mention = $"<@{_mainClient.CurrentUser.Id}>";
            var mentionNick = $"<@!{_mainClient.CurrentUser.Id}>";

            if (!basePrefixes.Contains(mention)) basePrefixes.Add(mention);
            if (!basePrefixes.Contains(mentionNick)) basePrefixes.Add(mentionNick);

            await Log(new LogMessage(LogSeverity.Info, "Prefixes", $"Added prefixes to bot: {basePrefixes.Aggregate("", (a, b) => { return $"{a}, {b}"; })}"));

            await LoadCommands();

            await LoadSlashCommands();

            await Log(new LogMessage(LogSeverity.Info, "Ready", $"Logged in as {_mainClient.CurrentUser} | prefixes: {string.Join(", ", basePrefixes)}"));

            _ = Task.Run(() => VerifySessionCleanup(_cts.Token));

            await Task.CompletedTask;
        }

        private async Task VerifySessionCleanup(CancellationToken token)
        {
            while(!token.IsCancellationRequested)
            {
                try
                {
                    VerificationHandler.Instance.CleanupExpired();
                }
                catch{}
                await Task.Delay(TimeSpan.FromMinutes(5), token);
            }
        }

        private async Task LoadCommands()
        {
            var newList = new List<ICommand>();

            foreach (var preLoad in GlobalFunctions.GetAllTypes<IPreLoad>())
            {
                try
                {
                    await Log(new LogMessage(LogSeverity.Debug, "PreLoad", $"Started {preLoad.Name} preload..."));
                    await ((IPreLoad)Activator.CreateInstance(preLoad)!).PreLoad(_mainClient);
                    await Log(new LogMessage(LogSeverity.Info, "PreLoad", $"{preLoad.Name} preload was sucsessful"));

                }
                catch (Exception e)
                {
                    await Log(new LogMessage(LogSeverity.Error, "Error", $"Error while running preload on {preLoad.Name}\n{e}"));
                }
            }

            foreach (var command in GlobalFunctions.GetAllTypes<ICommand>())
            {
                try
                {
                    newList.Add((ICommand)Activator.CreateInstance(command)!);
                    await Log(new LogMessage(LogSeverity.Info, "NewCommand", $"Added new command: {command.Name}"));
                }
                catch (Exception e)
                {
                    await Log(new LogMessage(LogSeverity.Error, "Error", $"Error while loading {command.Name}\n{e}"));
                }
            }


            CommandList = [.. newList];
        }

        private static SlashCommandProperties[] GetProperties(SlashScope scope) => [.. CommandList.OfType<Command>().Where(c => c.Info.Scope == scope).Select(c => c.BuildSlash()).Where(b => b is not null).Select(b => b.Build())];

        private static async Task<SlashCommandProperties[]> GetGuildPropertiesAsync(ulong guildId)
        {
            var builders = new List<SlashCommandBuilder>();

            var guildCommands = CommandList
                .OfType<Command>()
                .Where(c => c.Info.Scope == SlashScope.Guild);

            foreach (var cmd in guildCommands)
            {
                if (!await cmd.IsSlashAvailableAsync(guildId))
                    continue;

                var b = cmd.BuildSlash();
                if (b is not null)
                    builders.Add(b);
            }

            return builders.Select(b => b.Build()).ToArray();
        }

        private async Task LoadSlashCommands()
        {
            var globalProps = GetProperties(SlashScope.Global);

            try
            {
                await _mainClient.BulkOverwriteGlobalApplicationCommandsAsync(globalProps);
                foreach (var x in globalProps) await Log(new LogMessage(LogSeverity.Info, "SlashCommand", $"Registered {x.Name} to global slash commands"));
                foreach (var guild in _mainClient.Guilds)
                {
                    var guildProps = await GetGuildPropertiesAsync(guild.Id);

                    await _mainClient.Rest.BulkOverwriteGuildCommands(guildProps, guild.Id);
                    await Log(new LogMessage(LogSeverity.Info, $"SlashGuild", $"Registered {guildProps.Length} commands in guild {guild.Name} ({guild.Id})"));
                }

            }
            catch (Exception e)
            {
                await Log(new LogMessage(LogSeverity.Error, "Error", $"Error while loading slash commands\n{e}"));
            }
        }

        public static async Task UpdateSlashCommandAsync(DiscordSocketClient client, Command cmd, SocketGuild guild, bool shouldExist)
        {
            var appCommands = await client.Rest.GetGuildApplicationCommands(guild.Id);
            var name = cmd.Info.Name.ToLowerInvariant();

            var existing = appCommands.FirstOrDefault(c =>
                string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase));

            if (!shouldExist)
            {
                // If it already exists, nothing to do
                if (existing != null)
                    return;

                // Otherwise create just this one slash
                var builder = cmd.BuildSlash();
                await client.Rest.CreateGuildCommand(builder.Build(), guild.Id);

                var log = new LogMessage(
                    LogSeverity.Info,
                    "SlashGuild",
                    $"Created /{name} in guild {guild.Name} ({guild.Id})");

                Console.WriteLine(log);
            }
            else
            {
                // We want it gone
                if (existing == null)
                    return;

                await existing.DeleteAsync();

                var log = new LogMessage(
                    LogSeverity.Info,
                    "SlashGuild",
                    $"Deleted /{name} from guild {guild.Name} ({guild.Id})"
                );

                Console.WriteLine(log);
            }
        }


        //Event tasks below

        private async Task Log(LogMessage message)
        {
            Console.WriteLine(message.ToString());
            lock (OutputLogLock)
            {
                if (OutputLog.Count > 200) OutputLog.RemoveAt(0);
                OutputLog.Add(message);
            }
            await Task.CompletedTask;
        }
        //Base Message reciever
        private async Task MessageReceived(SocketMessage message)
        {
            try
            {
                if (message.Author.IsBot) return;

                var used = basePrefixes.FirstOrDefault(p => message.Content.StartsWith(p, StringComparison.OrdinalIgnoreCase));
                if (used is null) return;

                var tokens = GlobalFunctions.Lex(message.Content[used.Length..].Trim());
                if (tokens.Length == 0) return;

                var name = tokens[0].ToLowerInvariant();
                var args = tokens.Skip(1).ToArray();

                var match = GetMatchingCommand(name);

                if (match is null) return;

                await match.Run(message, _mainClient, used, name, args);
                await Log(new LogMessage(LogSeverity.Info, "CommandCall", $"Command {match.Info.Name} was called by {message.Author} in {message.Channel.Name}" + $"{(message.Channel as SocketGuildChannel)?.Guild.Name}"));
            }
            catch (Exception e)
            {
                await Log(new LogMessage(LogSeverity.Error, "Error in command", $"There was an error while running commands\n{e}"));
            }
            await Task.CompletedTask;
        }

        private async Task SlashCommandExecuted(SocketSlashCommand interaction)
        {
            try
            {
                var name = interaction.CommandName.ToLowerInvariant();

                var match = GetMatchingCommand(name);

                if (match is null)
                {
                    await interaction.RespondAsync("Unknown command.", ephemeral: true);
                }
                else
                {
                    await match.Run(interaction, _mainClient);
                    await Log(new LogMessage(LogSeverity.Info, "SlashCall", $"Command {match.Info.Name} was called by {interaction.User} in {interaction.Channel.Name}" + $"{(interaction.Channel as SocketGuildChannel)?.Guild.Name}"));
                }
            }
            catch (Exception e)
            {
                await Log(new LogMessage(LogSeverity.Error, "Error in slash", $"There was an error while running commands\n{e}"));
            }
        }

        private async Task ReactionAdded(Cacheable<IUserMessage, ulong> cacheableMessage, Cacheable<IMessageChannel, ulong> cacheableChannel, SocketReaction reaction)
        {
            try
            {
                if (reaction.UserId == _mainClient.CurrentUser.Id) return;

                var user = reaction.User.IsSpecified
                    ? reaction.User.Value
                    : await _mainClient.GetUserAsync(reaction.UserId);

                ReactionHandler.Invoke(reaction.MessageId, reaction.Emote, user);
                await Log(new LogMessage(LogSeverity.Info, "ReactionHandled", $"{user} reacted to a handler"));

                await Task.CompletedTask;
            }
            catch (Exception e)
            {
                await Log(new LogMessage(LogSeverity.Error, "Error in Reaction", $"There was an error while running reaction handler\n{e}"));
            }

        }



        public static async Task AutocompleteExecuted(SocketAutocompleteInteraction interaction)
        {
            if (!string.Equals(interaction.Data.CommandName, "help", StringComparison.OrdinalIgnoreCase))
                return;

            var focused = interaction.Data.Options.FirstOrDefault(o => o.Focused);
            if (focused == null || !string.Equals(focused.Name, "command", StringComparison.OrdinalIgnoreCase))
                return;

            var userInput = focused.Value?.ToString() ?? string.Empty;
            userInput = userInput.ToLowerInvariant();

            var allCommands = CommandList
                .OfType<Command>()
                .Where(c => c.Info != null);

            var matches = allCommands
                .Where(c =>
                    string.IsNullOrEmpty(userInput) ||
                    c.Info.Name.Contains(userInput, StringComparison.OrdinalIgnoreCase) ||
                    c.Info.Aliases.Any(a => a.Contains(userInput, StringComparison.OrdinalIgnoreCase)))
                .OrderBy(c => c.Info.Name)
                .Take(20)
                .Select(c => new AutocompleteResult(
                    c.Info.Name,
                    c.Info.Name
                ))
                .ToList();

            await interaction.RespondAsync(matches);
        }



        private Command? GetMatchingCommand(string name)
        {
            var match = CommandList.OfType<Command>().FirstOrDefault(c => c.Info.Aliases.Any(n => n.Equals(name, StringComparison.OrdinalIgnoreCase)));
            if (match is null) return null;
            else return match;
        }
    }
}