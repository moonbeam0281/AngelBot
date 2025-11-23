using System.Net;
using System.Text.Json;
using AngelBot.Classes;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.APIServices.ApiEndpoints
{
    public class AuthEndPoint : ApiEndpoint
    {
        public AuthEndPoint() : base(new ApiEndpointInfo
        {
            Path = "/auth/discord/exchange",
            Method = "POST",
            Description = "Authenticate user login."
        })
        { }

        public override async Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client)
        {
            ApplyCors(ctx.Response);

            try
            {
                // 1) Read JSON body: { "code": "..." }
                using var reader = new StreamReader(ctx.Request.InputStream, ctx.Request.ContentEncoding);
                var bodyText = await reader.ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(bodyText))
                {
                    ctx.Response.StatusCode = 400;
                    await Json(ctx.Response, new { ok = false, error = "Empty body" });
                    return;
                }

                using var doc = JsonDocument.Parse(bodyText);
                var root = doc.RootElement;
                if (!root.TryGetProperty("code", out var codeProp) || codeProp.ValueKind != JsonValueKind.String)
                {
                    ctx.Response.StatusCode = 400;
                    await Json(ctx.Response, new { ok = false, error = "Missing 'code' field" });
                    return;
                }

                var code = codeProp.GetString();
                if (string.IsNullOrWhiteSpace(code))
                {
                    ctx.Response.StatusCode = 400;
                    await Json(ctx.Response, new { ok = false, error = "Invalid code" });
                    return;
                }

                var clientId = $"{client.CurrentUser.Id}";
                var clientSecret = Environment.GetEnvironmentVariable("DISCORD_CLIENT_SECRET");
                var redirectUri = Environment.GetEnvironmentVariable("DISCORD_REDIRECT_URI");

                if (clientSecret is null || redirectUri is null)
                {
                    ctx.Response.StatusCode = 400;
                    await Json(ctx.Response, new { ok = false, error = ".env is missing data." });
                    return;
                }

                using var http = new HttpClient();

                // 2) Exchange code -> token
                var tokenContent = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["client_id"] = clientId,
                    ["client_secret"] = clientSecret,
                    ["grant_type"] = "authorization_code",
                    ["code"] = code,
                    ["redirect_uri"] = redirectUri
                });

                var tokenRes = await http.PostAsync("https://discord.com/api/oauth2/token", tokenContent);
                if (!tokenRes.IsSuccessStatusCode)
                {
                    var err = await tokenRes.Content.ReadAsStringAsync();
                    Console.WriteLine($"[OAuth] Token exchange failed: {err}");
                    ctx.Response.StatusCode = 500;
                    await Json(ctx.Response, new { ok = false, error = "Token exchange failed" });
                    return;
                }

                using var tokenDoc = JsonDocument.Parse(await tokenRes.Content.ReadAsStringAsync());
                var accessToken = tokenDoc.RootElement.GetProperty("access_token").GetString();

                // 3) Fetch user profile
                var userReq = new HttpRequestMessage(HttpMethod.Get, "https://discord.com/api/users/@me");
                userReq.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var userRes = await http.SendAsync(userReq);
                if (!userRes.IsSuccessStatusCode)
                {
                    var err = await userRes.Content.ReadAsStringAsync();
                    Console.WriteLine($"[OAuth] Fetch /users/@me failed: {err}");
                    ctx.Response.StatusCode = 500;
                    await Json(ctx.Response, new { ok = false, error = "Failed to fetch user profile" });
                    return;
                }

                var userJson = await userRes.Content.ReadAsStringAsync();
                using var userDoc = JsonDocument.Parse(userJson);
                var uRoot = userDoc.RootElement;



                var user = new
                {
                    id = uRoot.GetProperty("id").GetString(),
                    username = uRoot.GetProperty("username").GetString(),
                    discriminator = uRoot.GetProperty("discriminator").GetString(),
                    avatar = uRoot.TryGetProperty("avatar", out var av) && av.ValueKind == JsonValueKind.String
                        ? av.GetString()
                        : null
                };

                // ---------- NEW: fetch user's guilds & compute CommonGuilds ----------

                // Call Discord REST: /users/@me/guilds using the same accessToken
                var guildReq = new HttpRequestMessage(HttpMethod.Get, "https://discord.com/api/users/@me/guilds");
                guildReq.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var guildRes = await http.SendAsync(guildReq);

                List<CommonGuild> commonGuilds = new();

                if (guildRes.IsSuccessStatusCode)
                {
                    var guildJson = await guildRes.Content.ReadAsStringAsync();
                    using var guildDoc = JsonDocument.Parse(guildJson);
                    var gRoot = guildDoc.RootElement;

                    // user guilds from OAuth
                    var userGuilds = gRoot.EnumerateArray()
                        .Select(g => new
                        {
                            Id = g.GetProperty("id").GetString(),
                            Name = g.GetProperty("name").GetString(),
                            Icon = g.TryGetProperty("icon", out var ic) && ic.ValueKind == JsonValueKind.String
                                ? ic.GetString()
                                : null,
                            Owner = g.TryGetProperty("owner", out var ow) && ow.ValueKind == JsonValueKind.True,
                            Permissions = g.TryGetProperty("permissions", out var perm) && perm.ValueKind == JsonValueKind.Number
                                ? perm.GetUInt64()
                                : 0UL
                        })
                        .ToList();

                    // bot guilds from Discord.NET client
                    var botGuilds = client.Guilds.ToDictionary(g => g.Id.ToString(), g => g);

                    const ulong ADMINISTRATOR = 0x0000000000000008;

                    foreach (var ug in userGuilds)
                    {
                        if (ug.Id is null) continue;
                        if (!botGuilds.TryGetValue(ug.Id, out var botGuild))
                            continue; // not a mutual guild with the bot

                        var permission =
                            ug.Owner ? GuildPermission.Owner :
                            (ug.Permissions & ADMINISTRATOR) != 0 ? GuildPermission.AdminPermissions :
                            GuildPermission.CommonUser;

                        commonGuilds.Add(new CommonGuild
                        {
                            GuildId = ug.Id,
                            GuildName = ug.Name ?? "Unknown guild",
                            GuildAvatar = botGuild.IconUrl,   // Discord.NET gives CDN URL
                            GuildBanner = botGuild.BannerUrl, // may be null
                            Permission = permission
                        });
                    }
                }
                else
                {
                    var err = await guildRes.Content.ReadAsStringAsync();
                    Console.WriteLine($"[OAuth] Fetch /users/@me/guilds failed: {err}");
                    // if this fails we just leave commonGuilds empty
                }

                // 3) Build DashboardUser DTO
                var dashUser = new DashboardUser
                {
                    Id = user.id!,
                    Username = user.username!,
                    Discriminator = user.discriminator ?? "0",
                    Avatar = user.avatar,
                    CommonGuilds = commonGuilds
                };

                // 4) Create JWT with 7-day lifetime
                var jwt = JwtHelper.GenerateToken(dashUser, TimeSpan.FromDays(7));

                // 5) Set HttpOnly cookie
                var secure = false; // set true when using HTTPS
                DashboardAuth.SetAuthCookie(ctx.Response, jwt, secure);

                // 6) Respond with user (frontend does NOT see JWT)
                ctx.Response.StatusCode = 200;
                await Json(ctx.Response, new
                {
                    ok = true,
                    user = dashUser
                });
            }
            catch (Exception e)
            {
                Console.WriteLine($"[OAuth] Exception: {e}");
                ctx.Response.StatusCode = 500;
                await Json(ctx.Response, new { ok = false, error = "Internal auth error" });
            }
        }
    }
}