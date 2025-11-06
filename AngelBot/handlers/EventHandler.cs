using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
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
            "a!",
            "<@502122734437007360>",
            "<@!502122734437007360>"
        ];
        internal static readonly object OutputLogLock = new object();

        public DiscordEventHadnler(DiscordSocketClient client)
        {
            LoadCommands();
            _mainClient = client;

            client.Log += Log;

        }

        private async void ExecuteCommand(SocketMessage message, string commandPrefix)
        {
            foreach (var v in CommandList.Where(v => v is Command c && c.Names.Contains(commandPrefix.ToLower())))
            {
                if (v is not Command c) break;
                var x = new Stopwatch();
                x.Start();
                try
                {
                    v.Run(message, _mainClient, commandPrefix);
                }
                catch (Exception e)
                {
                    await Log(new LogMessage(LogSeverity.Critical, "Executer", $"ERROR {e.Message}!", e));
                }
                finally
                {
                    x.Stop();
                    if (!c.Names.Contains("any"))
                        await Log(new LogMessage(LogSeverity.Info, "Executer", $"{c.GetType().Name} executed in {(message.Channel as SocketGuildChannel)?.Guild.Name}, by {message.Author.Username}, done in  {x.ElapsedMilliseconds}ms..."));

                }
            }
        }

        private void LoadCommands()
        {
            var newList = new List<ICommand>();
            GlobalFunctions.GetAllTypes<ICommand>().ToList().ForEach(command => newList.Add((ICommand)Activator.CreateInstance(command)));
            GlobalFunctions.GetAllTypes<IPreLoad>().ToList().ForEach(command => ((IPreLoad)Activator.CreateInstance(command)).PreLoad(_mainClient));
            CommandList = [.. newList];
        }

        //Event tasks below

        private async Task Log(LogMessage message)
        {
            Console.WriteLine(message.ToString());
            lock (OutputLogLock)
            {
                if (OutputLog.Count > 200)
                {
                    OutputLog.RemoveAt(0);
                }

                OutputLog.Add(message);
            }
            await Task.CompletedTask;
        }

        private async Task MessageReceived(SocketMessage message)
        {
            try
            {
                if (message.Author.Id == 502122734437007360) return;
                var server = (message.Channel as SocketGuildChannel)?.Guild;

                if (server == null && message.Channel is not SocketDMChannel) return;

                var args = GlobalFunctions.Lex(message.Content);
                args = [.. args.Where(x => !string.IsNullOrEmpty(x))];

                //stuck here

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            await Task.CompletedTask;
        }
    }
}