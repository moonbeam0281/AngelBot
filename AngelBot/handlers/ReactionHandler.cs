using System;
using System.Collections.Generic;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    static class ReactionHandler
    {
        private static readonly Lock _lock = new();
        private static readonly Dictionary<(ulong MsgId, string Emote),
            (Action<IUser> Callback, bool Stay, long Expires)> _map = [];

        public static void AddReactionHandler(this IMessage msg, IEmote emote,
            Action<IUser> onClick, TimeSpan ttl, bool stay = true, bool removeReaction = true)
        {
            if (msg is IUserMessage um) _ = um.AddReactionAsync(emote);

            Action<IUser> wrapper = user =>
            {
                if (removeReaction && msg is IUserMessage rm)
                    _ = rm.RemoveReactionAsync(emote, user);
                onClick(user);
            };

            lock (_lock)
            {
                var key = (msg.Id, emote.Name);
                var expires = (DateTime.UtcNow + ttl).Ticks;

                if (_map.TryGetValue(key, out var existing))
                    _map[key] = (existing.Callback + wrapper, stay, expires);
                else
                    _map[key] = (wrapper, stay, expires);
            }
        }

        public static void Invoke(ulong messageId, string emoteName, IUser user)
        {
            if (user?.IsBot == true) return;

            var key = (messageId, emoteName);
            lock (_lock)
            {
                Console.WriteLine($"{emoteName}");
                if (!_map.TryGetValue(key, out var entry)) return;

                if (new DateTime(entry.Expires, DateTimeKind.Utc) < DateTime.UtcNow)
                {
                    _map.Remove(key);
                    return;
                }
                if (user == null) return;

                entry.Callback?.Invoke(user);
                if (!entry.Stay) _map.Remove(key);
            }
        }
    }

}
