using Discord;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using AngelBot.Interfaces;

namespace AngelBot.Commands
{
    class Ping : Command, ICommand
    {
        public Ping() : base("ping", "pong")
        {

        }

        public event EventHandler? CanExecuteChanged;

        public override EmbedBuilder HelpString()
            => new EmbedBuilder
            {
                Title = GetType().Name,
                Description = "Ping latency!",
                Color = new Color(255, 255, 128),
                Fields = new List<EmbedFieldBuilder>
                {
                    new EmbedFieldBuilder{Name = "I will display my ping latency!", Value = "```a!ping/pong```"}
                }
            };

        public void Run(SocketMessage message, DiscordSocketClient client, string prefix)
        {
            message.Channel.SendMessageAsync($":ping_pong: P{prefix[1]}ng! : **{client.Latency}**ms");
        }
    }
}