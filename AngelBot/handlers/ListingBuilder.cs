using System;
using System.Collections.Generic;
using System.Linq;
using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    public class ListingBuilder<T>(IEnumerable<T> list, Func<IEnumerable<T>, ListingBuilder<T>.LocationInformation, Embed> redraw, int time = 2, int first = 1, int disp = 10, Emote? lEmote = null, Emote? rEmote = null)
    {
        public struct LocationInformation
        {
            public int Min { get; set; }
            public int Max { get; set; }
            public int Current { get; set; }
            public IEnumerable<T> List { get; set; }
        }
        private readonly IEnumerable<T> _list = list;
        private readonly int _first = first;
        private readonly int _disp = disp;
        private readonly Func<IEnumerable<T>, LocationInformation, Embed> _redraw = redraw;
        private readonly Emoji _rightEmoji = new("▶️");
        private readonly Emote? _rightEmote = rEmote is not null ? rEmote : null;
        private readonly Emoji _leftEmoji = new("◀️");
        private readonly Emote? _leftEmote = lEmote is not null ? lEmote : null;
        private readonly TimeSpan _timeOut = TimeSpan.FromMinutes(time);

        private (int, int) Range(int current)
        {
            int min, max;

            if (current <= 1)
            {
                max = _disp - 1;
                min = 0;
            }
            else
            {
                min = (current - 1) * _disp;
                max = min + (_disp - 1);
            }

            if (min >= _list.Count())
                min = _list.Count() - 1;
            if (max >= _list.Count())
                max = _list.Count();

            if (min > 0 || max > 0) return (min, max);
            min = 0;
            max = 0;

            return (min, max);
        }

        private static int Back(ref int current)
            => current <= 1 ? 1 : --current;

        private int Front(ref int current)
            => (float)current >= ((float)_list.Count() / (float)_disp) ? current : ++current;



        public void Send(ISocketMessageChannel channel)
        {
            var current = _first;
            var (min, max) = Range(current);
            var m = channel.SendMessageAsync(string.Empty, false, _redraw(_list.ToList().GetRange(min, max - min), new LocationInformation()
            {
                Min = min,
                Max = max,
                Current = current,
                List = _list
            })).Result;

            if (_leftEmote is not null)
            {
                m.AddReactionHandler(_leftEmote, u =>
                {
                    var (bot, top) = Range(Back(ref current));
                    m.ModifyAsync(msg => msg.Embed = _redraw(_list.ToList().GetRange(bot, top - bot), new LocationInformation()
                    {
                        Min = bot,
                        Max = top,
                        Current = current,
                        List = _list
                    }));
                }, _timeOut);

            }
            else
            {
                m.AddReactionHandler(_leftEmoji, u =>
                {
                    var (bot, top) = Range(Back(ref current));
                    m.ModifyAsync(msg => msg.Embed = _redraw(_list.ToList().GetRange(bot, top - bot), new LocationInformation()
                    {
                        Min = bot,
                        Max = top,
                        Current = current,
                        List = _list
                    }));
                }, _timeOut);
            }

            if (_rightEmote is not null)
            {
                m.AddReactionHandler(_rightEmote, u =>
                {
                    var (bot, top) = Range(Front(ref current));
                    m.ModifyAsync(msg => msg.Embed = _redraw(_list.ToList().GetRange(bot, top - bot), new LocationInformation()
                    {
                        Min = bot,
                        Max = top,
                        Current = current,
                        List = _list
                    }));
                }, _timeOut);
            }
            else
            {
                m.AddReactionHandler(_rightEmoji, u =>
                {
                    var (bot, top) = Range(Front(ref current));
                    m.ModifyAsync(msg => msg.Embed = _redraw(_list.ToList().GetRange(bot, top - bot), new LocationInformation()
                    {
                        Min = bot,
                        Max = top,
                        Current = current,
                        List = _list
                    }));
                }, _timeOut);
            }
        }


    }
}