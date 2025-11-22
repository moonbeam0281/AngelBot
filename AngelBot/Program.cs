using AngelBot.APIServices;
using AngelBot.Database;
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
            GatewayIntents =
                GatewayIntents.Guilds |
                GatewayIntents.GuildMessages |
                GatewayIntents.GuildMessageReactions |
                GatewayIntents.DirectMessages |
                GatewayIntents.DirectMessageReactions |
                GatewayIntents.MessageContent
        };
        private static readonly DiscordSocketClient Client = new(Config);
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
            var eventHandler = new DiscordEventHandler(Client);
            Console.WriteLine("[AngelBot] Starting database...");
            await DatabaseHandler.Instance.ApplySchemasAsync();
            Console.WriteLine("Starting up...");
            await Client.StartAsync();
            Console.WriteLine("Bot is running!");
            var apiServer = new ApiServer(eventHandler, Client);
            apiServer.Start();
            await Task.Delay(-1);
        }
    }

}
