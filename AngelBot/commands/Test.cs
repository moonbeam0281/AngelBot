using AngelBot.Classes;
using AngelBot.Handlers;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Commands
{
    class Test : Command
    {
        public Test() : base("test")
        {

        }

        public override SlashScope Scope => SlashScope.Global;

        public override EmbedBuilder HelpString()
            => new()
            {
                Title = GetType().Name,
                Description = "Testing command! Only available for **Moonbeam**!~",
                Color = new Color(255, 255, 128),
                Fields =
                [
                    new EmbedFieldBuilder{Name = "Who know what it does, Could be anything :thinking:", Value = "```a!test```"}
                ]
            };

        private int[] myArr = [1,2,3,5,6,23,5643,234,12,132,5342,6354,234,123,43,534,634,7,8,34,8,9,45,2,7,2,7,2726,642,7635,243];

        public override Task Run(SocketMessage message, DiscordSocketClient client, string usedPrefix, string usedCommandName, string[] args)
        {
            if (message.Author.Id != 214442156788678658)
            {
                message.Channel.SendMessageAsync("Sorry!~ Only my owner **Moonbeam** can run that command~!");
                return Task.CompletedTask;
            }
            _ = new ListingBuilder<int>(myArr, (range, info) =>
            {
                var e = new EmbedBuilder()
                {
                    Title = "Testing listing builder"
                };
                foreach(var x in range)
                {
                    e.AddField("Numbering...", x);
                }
                return e.Build();
            }).SendAsync(message.Channel);
            return Task.CompletedTask;
        }

        public override SlashCommandBuilder BuildSlash()
            => new()
            {
                Name = GetType().Name.ToLowerInvariant(),
                Description = "Testing command! Only available for **Moonbeam**!~"
            };

        public override async Task Run(SocketSlashCommand interaction, DiscordSocketClient client)
        {
            if(interaction.User.Id != 214442156788678658)
            {
                await interaction.RespondAsync("Sorry!~ Only my owner **Moonbeam** can run that command~!");
            }
            
        }
    }
}