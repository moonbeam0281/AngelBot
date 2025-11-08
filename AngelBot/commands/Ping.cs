using Discord;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using AngelBot.Interfaces;

namespace AngelBot.Commands
{
    class Ping : Command
    {
        public Ping() : base("ping", "pong")
        {

        }

        public override EmbedBuilder HelpString()
            => new()
            {
                Title = GetType().Name,
                Description = "Ping latency!",
                Color = new Color(255, 255, 128),
                Fields =
                [
                    new EmbedFieldBuilder{Name = "I will display my ping latency!", Value = "```a!ping/pong```"}
                ]
            };

        public override Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string[] args)
        {
            message.Channel.SendMessageAsync($":ping_pong: P{usedPrefix[1]}ng! : **{client.Latency}**ms");

            return Task.CompletedTask;
        }
    }
}