using System.Net;
using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class VerifyTokenEndPoint : ApiEndpoint
    {
        public VerifyTokenEndPoint() : base(new ApiEndpointInfo
        {
            Path = "/verify/token",
            Method = "GET",
            Description = "Check if token is expired"
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {

            try
            {
                var request = ctx.Request;
                var response = ctx.Response;

                if (request.HttpMethod == "OPTIONS")
                {
                    ApplyCors(response);
                    response.StatusCode = 200;
                    response.Close();
                    return;
                }

                ApplyCors(response);

                // Extract query params
                var query = request.QueryString;

                var token = query["token"];
                var guildIdStr = query["guildId"];

                if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(guildIdStr))
                {
                    await Json(response, new
                    {
                        success = false,
                        error = "Missing guildId or token"
                    });
                    return;
                }

                if (!ulong.TryParse(guildIdStr, out var guildId))
                {
                    await Json(response, new
                    {
                        success = false,
                        error = "Invalid guildId"
                    });
                    return;
                }

                var session = VerificationHandler.Instance.GetSession(token);

                if (session == null)
                {
                    await Json(response, new
                    {
                        success = false,
                        error = "expired"
                    });
                    return;
                }

                // Check if the session belongs to this guild
                if (session.GuildId != guildId)
                {
                    await Json(response, new
                    {
                        success = false,
                        error = "Guild mismatch"
                    });
                    return;
                }

                // Success
                await Json(response, new
                {
                    success = true,
                    data = new
                    {
                        guildId = session.GuildId,
                        userId = session.UserId,
                        expiresAt = session.ExpiresAt
                    }
                });
            }
            catch (Exception e)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Internal server error",
                    details = e.Message
                }, 500);
            }
        }
    }
}