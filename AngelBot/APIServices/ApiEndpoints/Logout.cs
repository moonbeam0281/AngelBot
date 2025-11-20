using System.Net;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class LogoutEndpoint : ApiEndpoint
    {
        public LogoutEndpoint() : base(new ApiEndpointInfo
        {
            Path = "/auth/logout",
            Method = "POST",
            Description = "Logout dashboard user."
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            var secure = false;
            DashboardAuth.ClearAuthCookie(ctx.Response, secure);

            ctx.Response.StatusCode = 200;
            await Json(ctx.Response, new { ok = true });
        }
    }
}
