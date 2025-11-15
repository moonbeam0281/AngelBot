using System.Net;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class StatusEndPoint : ApiEndpoint
    {
        public StatusEndPoint() : base(new ApiEndpointInfo
        {
            Path = "/status",
            Method = "GET",
            Description = "Simple health check."
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            var guilds = client.Guilds.Select(g => new
            {
                id = g.Id,
                name = g.Name,
                memberCount = g.MemberCount
            }).ToList();

            await Json(ctx.Response, new
            {
                ok = true,
                botName = client.CurrentUser.ToString(),
                botId = client.CurrentUser.Id,
                status = client.Status.ToString(),
                connectionState = client.ConnectionState.ToString(),
                latency = client.Latency,
                guildCount = guilds.Count,
                guilds
            });
        }
    }
}
