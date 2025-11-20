using System.Net;
using AngelBot.Classes;
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

            var bot = client.CurrentUser;
            var botId = bot.Id.ToString();

            string avatarUrl;
            if (!string.IsNullOrEmpty(bot.AvatarId))
            {
                var avatarHash = bot.AvatarId;
                var avatarExt = avatarHash.StartsWith("a_") ? "gif" : "png";
                avatarUrl = $"https://cdn.discordapp.com/avatars/{botId}/{avatarHash}.{avatarExt}?size=256";
            }
            else
            {
                var defaultIndex = 0;
                avatarUrl = $"https://cdn.discordapp.com/embed/avatars/{defaultIndex}.png";
            }

            string? bannerUrl = null;
            if (!string.IsNullOrEmpty(bot.BannerId))
            {
                var bannerHash = bot.BannerId;
                var bannerExt = bannerHash.StartsWith("a_") ? "gif" : "png";
                bannerUrl = $"https://cdn.discordapp.com/banners/{botId}/{bannerHash}.{bannerExt}?size=600";
            }

            await Json(ctx.Response, new
            {
                ok = true,
                bot = new
                {
                    id = bot.Id,
                    name = bot.GlobalName,
                    avatar = avatarUrl,
                    banner = bannerUrl
                }
            });
        }
    }
}
