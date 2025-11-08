using AngelBot.Handlers;
using Discord;
using Discord.WebSocket;
using dotenv.net;


namespace AngelBot
{
    internal class Program
    {
        private static readonly DiscordSocketConfig Config = new()
        {
            MessageCacheSize = 100,
            GatewayIntents =
                GatewayIntents.Guilds
                | GatewayIntents.GuildMessages
                | GatewayIntents.MessageContent
        };
        private static readonly DiscordSocketClient Client = new(Config);
        private static DiscordEventHadnler? _Events;

        private static async Task Main()
        {
            DotEnv.Load();

            var token = Environment.GetEnvironmentVariable("DISCORD_TOKEN");

            if (string.IsNullOrEmpty(token))
            {
                Console.WriteLine("Token was not loaded properly");
                return;
            }
            Console.WriteLine("Logging into bot using token...");
            await Client.LoginAsync(TokenType.Bot, token);
            Console.WriteLine("Starting up...");
            await Client.StartAsync();
            Console.WriteLine("Bot is running!");
            _Events = new DiscordEventHadnler(Client);
            await Task.Delay(-1);
        }
    }

}
