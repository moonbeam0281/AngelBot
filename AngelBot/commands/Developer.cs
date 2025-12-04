using AngelBot.Classes;
using AngelBot.Database.Repositories;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;
using static AngelBot.Database.Repositories.DeveloperRepo;

namespace AngelBot.Commands
{
    public class Developer : Command
    {
        public Developer() : base(new CommandInfo
        {
            Name = "developer",
            Description = "Owner only command, sets or unsets a Discord user as developer.",
            Aliases = ["developer", "dev"],
            Color = new Color(214, 153, 255),
            Scope = SlashScope.None,
            Category = CommandCategory.Developer,
            UsageExamples = ["a!dev @user", "angel dev 123456789012345678"],
            UsageScopes = [UsageScope.Owner]
        })
        { }

        public override async Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            if (message.Channel is not SocketGuildChannel gChannel)
            {
                await message.Channel.SendMessageAsync("This command can only be used in a server.");
                return;
            }

            var guild = gChannel.Guild;

            if (args.Length < 1)
            {
                var devList = await Instance.GetAllDevelopersAsync();
                var devListBuilder = new ListingBuilder<DevUser>(devList, (range, info) =>
                {
                    var e = new EmbedBuilder
                    {
                        Title = "Developer list",
                        Description = "Listing all the developers that can use all the commands:",
                        Color = Info.Color
                    };

                    foreach(var x in range)
                    {
                        var tempUser = client.GetUserAsync(x.UserId);
                        e.AddField($"```{tempUser.Result.GlobalName}```", $"Details: Added at: {x.AddedAt} - by <@{x.AddedBy}>");
                    }

                    return e.Build();
                }, disp: 7, allowedUserId: message.Author.Id);

                await devListBuilder.SendAsync(message.Channel);
                return;
            }

            var raw = args[0];

            if (raw.StartsWith("<@") && raw.EndsWith(">"))
            {
                raw = raw.Trim('<', '>', '@', '!');
            }

            if (!ulong.TryParse(raw, out var userId))
            {
                await message.Channel.SendMessageAsync("Invalid user mention or ID.");
                return;
            }

            var targetUser = guild.GetUser(userId);

            if(message.Author.Id == targetUser.Id)
            {
                await message.Channel.SendMessageAsync("You can't **add/remove** yourself.");
                return;
            }

            var isDev = await Instance.IsDeveloperAsync(userId);

            if (!isDev)
            {
                await Instance.SetDeveloperAsync(userId, true, message.Author.Id);

                await message.Channel.SendMessageAsync(
                    $"✅ `{targetUser?.Username ?? userId.ToString()}` has been **added** as a developer."
                );
            }
            else
            {
                await Instance.SetDeveloperAsync(userId, false, message.Author.Id);

                await message.Channel.SendMessageAsync(
                    $"🚫 `{targetUser?.Username ?? userId.ToString()}` has been **removed** from developers."
                );
            }
        }

        public override Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            // no slash version for now
            return Task.CompletedTask;
        }

    }
}
