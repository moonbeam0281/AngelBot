using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using AngelBot.Classes;
using Discord.WebSocket;
using AngelBot.Handlers;
using AngelBot.Interfaces;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class VerifyEndPoint : ApiEndpoint
    {
        public VerifyEndPoint() : base(new ApiEndpointInfo
        {
            Path = "/verify/user/server",
            Method = "POST",
            Description = "Verifying user in server"
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            VerifyUserRequest? payload;

            try
            {
                using var reader = new StreamReader(ctx.Request.InputStream, ctx.Request.ContentEncoding);
                var body = await reader.ReadToEndAsync();

                payload = JsonSerializer.Deserialize<VerifyUserRequest>(body, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    NumberHandling = JsonNumberHandling.AllowReadingFromString
                });
            }
            catch
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Invalid JSON body"
                }, 400);
                return;
            }

            if (payload == null || payload.GuildId == 0 || string.IsNullOrWhiteSpace(payload.Token))
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Missing guildId or token"
                }, 400);
                return;
            }

            // Check if bot is in the guild
            var guild = client.GetGuild(payload.GuildId);
            if (guild == null)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Guild not found or bot is not in this server"
                }, 404);
                return;
            }

            // 🔑 Look up and complete verification session by token
            var session = VerificationHandler.Instance.CompleteSession(payload.Token);

            if (session == null || session.GuildId != payload.GuildId)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Invalid or expired verification token."
                }, 400);
                return;
            }

            // Get the user in this guild
            var user = guild.GetUser(session.UserId);
            if (user == null)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "User not found in this guild. Are you still in the server?"
                }, 404);
                return;
            }

            // Get guild verification config (role) from DB/cache
            var cfg = await VerificationHandler.Instance.GetGuildConfigAsync(guild.Id);
            if (cfg == null)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Verification is not properly configured for this server."
                }, 500);
                return;
            }

            // Prefer the role stored in the session if present, otherwise from config
            ulong? roleId = session.RoleId ?? cfg.VerificationRoleId;

            if (roleId == null)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Verification role is not set for this server."
                }, 500);
                return;
            }

            var role = guild.GetRole(roleId.Value);
            if (role == null)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = "Verification role not found in this server."
                }, 500);
                return;
            }

            try
            {
                await user.AddRoleAsync(role);

                await Json(ctx.Response, new
                {
                    success = true,
                    message = $"You have been verified in **{guild.Name}** as {role.Name}. You can now return to Discord.",
                    guildId = guild.Id,
                    guildName = guild.Name,
                    roleId = role.Id,
                    roleName = role.Name
                }, 200);
            }
            catch (Exception e)
            {
                await Json(ctx.Response, new
                {
                    success = false,
                    error = $"Failed to assign role: {e.Message}"
                }, 500);
            }
        }
    }

    public class VerifyUserRequest
    {
        public ulong GuildId { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
