using Discord;

namespace AngelBot.Handlers
{
    public static class ReactionHandler
    {
        private static readonly object _lock = new();

        private static readonly Dictionary<ulong, Dictionary<string, (Action<IUser> Callback, bool Stay, long Expires)>> _map = [];

        private static string EmoteKey(IEmote emote) =>
            emote switch
            {
                Emote custom => $"C:{custom.Id}",
                Emoji emoji => $"U:{emoji.Name}",
                _ => $"X:{emote.ToString()}"
            };
        public static void AddReactionHandler(
            this IMessage msg,
            IEmote emote,
            Action<IUser> onClick,
            TimeSpan ttl,
            bool stay = true,
            bool removeReaction = true)
        {
            if (msg is IUserMessage um)
                _ = um.AddReactionAsync(emote);

            Action<IUser> wrapper = user =>
            {
                if (removeReaction && msg is IUserMessage rm)
                    _ = rm.RemoveReactionAsync(emote, user);

                onClick(user);
            };

            var messageId = msg.Id;
            var emoteKey = EmoteKey(emote);
            var expires = (DateTime.UtcNow + ttl).Ticks;

            lock (_lock)
            {
                if (!_map.TryGetValue(messageId, out var perMessage))
                {
                    perMessage = new();
                    _map[messageId] = perMessage;
                }

                if (perMessage.TryGetValue(emoteKey, out var existing))
                {
                    perMessage[emoteKey] = (existing.Callback + wrapper, stay, expires);
                }
                else
                {
                    perMessage[emoteKey] = (wrapper, stay, expires);
                }
            }
        }

        public static void Invoke(ulong messageId, IEmote emote, IUser user)
        {
            if (user?.IsBot == true) return;

            var emoteKey = EmoteKey(emote);
            var nowTicks = DateTime.UtcNow.Ticks;

            lock (_lock)
            {
                if (!_map.TryGetValue(messageId, out var perMessage))
                    return;

                if (!perMessage.TryGetValue(emoteKey, out var entry))
                    return;

                if (entry.Expires < nowTicks)
                {
                    perMessage.Remove(emoteKey);
                    if (perMessage.Count == 0)
                        _map.Remove(messageId);
                    return;
                }
                if (user is null) return;
                entry.Callback?.Invoke(user);

                if (!entry.Stay)
                {
                    perMessage.Remove(emoteKey);
                    if (perMessage.Count == 0)
                        _map.Remove(messageId);
                }
            }
        }
    }
}
