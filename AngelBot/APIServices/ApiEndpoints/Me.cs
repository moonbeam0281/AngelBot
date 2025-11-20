using System.Net;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class MeEndpoint : ApiEndpoint
    {
        public MeEndpoint() : base(new ApiEndpointInfo
        {
            Path = "/auth/me",
            Method = "GET",
            Description = "Return current dashboard user based on JWT cookie."
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            var user = DashboardAuth.GetUserFromContext(ctx);
            if (user == null)
            {
                ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await Json(ctx.Response, new { ok = false, error = "Not logged in" });
                return;
            }

            await Json(ctx.Response, new
            {
                ok = true,
                user
            });
        }
    }
}
