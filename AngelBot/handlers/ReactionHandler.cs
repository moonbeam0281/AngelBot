using System;
using System.Collections.Generic;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    static class ReactionHandler
    {
        private static readonly Dictionary<Tuple<ulong, string>, Tuple<Action<IUser>,bool,long>> List = new Dictionary<Tuple<ulong, string>, Tuple<Action<IUser>,bool,long>>();
        private static readonly Lock Lock = new();

        public static void AddReactionHandler(this IMessage msg, Emote rec, Action<IUser> x, TimeSpan t, bool stay = true, bool removereaction = true)
        {
            if (msg is IUserMessage m)
            {
                m.AddReactionAsync(rec);
            }

            Add(msg, rec, x + (y =>
            {
                if (removereaction && msg is IUserMessage z) z.RemoveReactionAsync(rec, y);

            }), t, stay);
        }

        public static void AddReactionHandler(this IMessage msg, Emoji rec, Action<IUser> x, TimeSpan t, bool stay = true, bool removereaction = true)
        {
            if (msg is IUserMessage m)
            {
                m.AddReactionAsync(rec);
            }

            Add(msg, rec, x + (y =>
            {
                if (removereaction && msg is IUserMessage z) z.RemoveReactionAsync(rec, y);

            }), t, stay);
        }

        private static void Add(IMessage msg, Emote rec, Action<IUser> x, TimeSpan t, bool stay = true)
        {
            var r = new Tuple<ulong, string>(msg.Id, rec.Name);

            lock (Lock)
            {
                if (List.ContainsKey(r))
                {
                    List[r] = new Tuple<Action<IUser>, bool, long>(List[r].Item1 + x, stay, (DateTime.Now + t).ToBinary());
                }
                else
                {
                    List.Add(r, new Tuple<Action<IUser>, bool, long>(x, stay, (DateTime.Now + t).ToBinary()));
                }
            }

        }
        
        private static void Add(IMessage msg, Emoji rec, Action<IUser> x, TimeSpan t, bool stay = true)
        {
            var r = new Tuple<ulong, string>(msg.Id, rec.Name);

            lock(Lock)
            {
                if (List.ContainsKey(r))
                {
                    List[r] = new Tuple<Action<IUser>, bool, long>(List[r].Item1 + x, stay, (DateTime.Now + t).ToBinary());
                }
                else
                {
                    List.Add(r, new Tuple<Action<IUser>, bool, long>(x, stay, (DateTime.Now + t).ToBinary()));
                }
            }

        }

        public static void Invoke(ulong msg, string rec, IUser usr)
        {
            try
            {
                if (usr.IsBot) return;
                var r = new Tuple<ulong, string>(msg, rec);

                lock (Lock)
                {
                    if (!List.ContainsKey(r)) return;
                    if (DateTime.FromBinary(List[r].Item3) < DateTime.Now)
                    {
                        List.Remove(r);
                        return;
                    }

                    List[r].Item1.Invoke(usr);

                    if (!List[r].Item2)
                        List.Remove(r);
                }
            } catch(Exception e)
            {
                Console.WriteLine(e);
            }
        }

    }
}
