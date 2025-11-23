using System.Net;
using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class BotInfoEndpoint : ApiEndpoint
    {
        public BotInfoEndpoint() : base(new ApiEndpointInfo
        {
            Path = "/info/bot",
            Method = "GET",
            Description = "Return bot name, avatar, banner"
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            var botUser = await client.Rest.GetUserAsync(client.CurrentUser.Id);

            string avatarUrl;
            if (!string.IsNullOrEmpty(botUser.AvatarId))
            {
                var avatarHash = botUser.AvatarId;
                var avatarExt = avatarHash.StartsWith("a_") ? "gif" : "png";
                avatarUrl = $"https://cdn.discordapp.com/avatars/{botUser.Id}/{avatarHash}.{avatarExt}?size=256";
            }
            else
            {
                var defaultIndex = 0;
                avatarUrl = $"https://cdn.discordapp.com/embed/avatars/{defaultIndex}.png";
            }

            string? bannerUrl = null;
            if (!string.IsNullOrEmpty(botUser.BannerId))
            {
                var bannerHash = botUser.BannerId;
                var bannerExt = bannerHash.StartsWith("a_") ? "gif" : "png";
                bannerUrl = $"https://cdn.discordapp.com/banners/{botUser.Id}/{bannerHash}.{bannerExt}?size=600";
            }

            var commands = DiscordEventHandler.CommandList.Select(c => c.Info);

            await Json(ctx.Response, new
            {
                ok = true,
                bot = new
                {
                    id = botUser.Id,
                    name = botUser.Username,
                    avatar = avatarUrl,
                    banner = bannerUrl,
                    serverCount = client.Guilds.Count,
                    status = client.ConnectionState.ToString(),
                    usersCount = client.Guilds.Sum(g => g.MemberCount),
                    commands
                }
            });
        }
    }
}
