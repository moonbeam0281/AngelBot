using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    public class DiscordEventHadnler
    {
        private readonly DiscordSocketClient _mainClient;
        internal readonly List<LogMessage> OutputLog = [];
        internal ICommand[] CommandList = [];
        private readonly List<string> basePrefixes =
        [
            "angel",
            "a!"
        ];
        internal static readonly object OutputLogLock = new();

        public DiscordEventHadnler(DiscordSocketClient client)
        {
            _mainClient = client;

            client.Log += Log;
            client.Ready += OnReady;

            client.MessageReceived += MessageReceived;
            client.SlashCommandExecuted += SlashCommandExecuted;

        }

        private async Task OnReady()
        {
            var mention = $"<@{_mainClient.CurrentUser.Id}>";
            var mentionNick = $"<@!{_mainClient.CurrentUser.Id}>";

            if (!basePrefixes.Contains(mention)) basePrefixes.Add(mention);
            if (!basePrefixes.Contains(mentionNick)) basePrefixes.Add(mentionNick);

            Console.WriteLine($"Added prefixes to bot: {basePrefixes.Aggregate("", (a, b) => { return $"{a}, {b}"; })}");

            LoadCommands();

            await LoadSlashCommands();

            await Log(new LogMessage(LogSeverity.Info, "Ready",
            $"Logged in as {_mainClient.CurrentUser} | prefixes: {string.Join(", ", basePrefixes)}"));

            await Task.CompletedTask;
        }

        private void LoadCommands()
        {
            var newList = new List<ICommand>();

            GlobalFunctions.GetAllTypes<IPreLoad>().ToList().ForEach(command =>
            {
                try
                {
                    Console.WriteLine($"Loaded {command.Name} and ran preload...");
                    ((IPreLoad)Activator.CreateInstance(command)!).PreLoad(_mainClient);
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error while running...\n{e}");
                }
            });

            GlobalFunctions.GetAllTypes<ICommand>().ToList().ForEach(command =>
            {
                try
                {
                    Console.WriteLine($"Added new command: {command.Name}");
                    newList.Add((ICommand)Activator.CreateInstance(command)!);
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error while loading...\n{e}");
                }
            });


            CommandList = [.. newList];
        }

        private async Task LoadSlashCommands()
        {
            var slashBuilders = CommandList.OfType<ICommand>()
                .Select(c => (cmd: c, builder: c.BuildSlash()))
                .Where(x => x.builder is not null)
                .ToArray();
            
            var dupes = slashBuilders
                .GroupBy(x => x.builder!.Name)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToArray();

            if (dupes.Length > 0)
                Console.WriteLine($"[Slash] Duplicate names: {string.Join(", ", dupes)}");

            var slashProps = slashBuilders
                .Select(x => x.builder!.Build())
                .ToArray();

            foreach(var x in slashProps)
            {
                Console.WriteLine($"Slash command: {x.Name}");
            }
            try
            {
                //await _mainClient.BulkOverwriteGlobalApplicationCommandsAsync([]);
                foreach (var guild in _mainClient.Guilds)
                {
                    await _mainClient.Rest.BulkOverwriteGuildCommands(slashProps, guild.Id);
                    Console.WriteLine($"[Slash] Registered {slashProps.Length} commands in guild {guild.Name} ({guild.Id})");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine($"{e}");
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

        private async Task MessageReceived(SocketMessage message)
        {
            try
            {
                if (message.Author.Id == 502122734437007360 || message.Author.IsBot) return;

                var used = basePrefixes.FirstOrDefault(p => message.Content.StartsWith(p, StringComparison.OrdinalIgnoreCase));
                if (used is null) return;

                var server = (message.Channel as SocketGuildChannel)?.Guild;

                if (server == null && message.Channel is not SocketDMChannel) return;

                var tokens = GlobalFunctions.Lex(message.Content[used.Length..].Trim());
                if (tokens.Length == 0) return;

                var name = tokens[0].ToLowerInvariant();
                var args = tokens.Skip(1).ToArray();

                var match = GetMatchingCommand(name);

                if (match is null) return;

                await match.Run(message, _mainClient, used, args);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            await Task.CompletedTask;
        }

        private async Task SlashCommandExecuted(SocketSlashCommand interaction)
        {
            try
            {
                var name = interaction.CommandName.ToLowerInvariant();

                var match = GetMatchingCommand(name);

                if (match is null) await interaction.RespondAsync("Unknown command.", ephemeral: true);
                else await match.Run(interaction, _mainClient);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error while running slash command:\n{e}");
                await interaction.RespondAsync($"Error while running slash command: ```{e}```");
            }
        }

        private Command? GetMatchingCommand(string name)
        {
            var match = CommandList.OfType<Command>().FirstOrDefault(c => c.Names.Any(n => n.Equals(name, StringComparison.OrdinalIgnoreCase)));
            if (match is null) return null;
            else return match;
        }
    }
}