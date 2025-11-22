using System.Net;
using AngelBot.Classes;
using AngelBot.Database;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class DbInfoEndpoint : ApiEndpoint
    {
        public DbInfoEndpoint() : base(new ApiEndpointInfo
        {
            Path = "/info/db",
            Method = "GET",
            Description = "Checks if the database is reachable."
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            // Small DB check
            bool ok = await DatabaseHandler.Instance.CheckConnectionAsync();

            await Json(ctx.Response, new
            {
                database = ok ? "online" : "offline",
                ok
            });
        }
    }
}
