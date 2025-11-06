using Discord;
using System.Collections.Generic;

namespace AngelBot
{
    public abstract class Command(params string[] names)
    {
        public readonly string[] Names = names;
        public abstract EmbedBuilder HelpString();
    }
}
