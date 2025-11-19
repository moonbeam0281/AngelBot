using System.Net;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class DiscordLoginEndpoint : ApiEndpoint
    {
        public DiscordLoginEndpoint() : base(new ApiEndpointInfo
        {
            Path = "/auth/discord/login",
            Method = "GET",
            Description = "Redirect to Discord OAuth2 login"
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            var clientId = $"{client.CurrentUser.Id}";
            var redirectUri = Environment.GetEnvironmentVariable("DISCORD_REDIRECT_URI");

            var url = $"https://discord.com/api/oauth2/authorize" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={WebUtility.UrlEncode(redirectUri)}" +
                      $"&response_type=code&scope=identify";

            ctx.Response.Redirect(url);
            ctx.Response.Close();
        }
    }
}
