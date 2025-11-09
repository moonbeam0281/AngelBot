using System.Dynamic;
using System.Security.Authentication;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    public class DiscordEventHadnler
    {
        private readonly DiscordSocketClient _mainClient;
        internal readonly List<LogMessage> OutputLog = [];
        public static ICommand[] CommandList = [];
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

            //Add reaction event handler for reactions and listing
            //client.ReactionAdded += Something

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
            var globalProps = CommandList.OfType<Command>().Where(c => c.Scope == SlashScope.Global)
            .Select(c => c.BuildSlash()).Where(b => b is not null).Select(b => b!.Build()).ToArray();

            var guildProps = CommandList.OfType<Command>().Where(c => c.Scope == SlashScope.Guild)
            .Select(c => c.BuildSlash()).Where(c => c is not null).Select(b => b!.Build()).ToArray();

            try
            {
                await _mainClient.BulkOverwriteGlobalApplicationCommandsAsync(globalProps);
                foreach (var x in globalProps) Console.WriteLine($"[Slash] Registered {x.Name} to global slash commands...");
                foreach (var guild in _mainClient.Guilds)
                {
                    await _mainClient.Rest.BulkOverwriteGuildCommands(guildProps, guild.Id);
                    Console.WriteLine($"[Slash] Registered {guildProps.Length} commands in guild {guild.Name} ({guild.Id})");
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