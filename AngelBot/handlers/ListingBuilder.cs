using Discord;
using Discord.WebSocket;

namespace AngelBot.Handlers
{
    public class ListingBuilder<T>(
        IEnumerable<T> list,
        Func<IEnumerable<T>, ListingBuilder<T>.LocationInformation, Embed> redraw,
        int time = 2,
        int first = 1,
        int disp = 10,
        Emote? lEmote = null,
        Emote? rEmote = null,
        ulong? allowedUserId = null
    )
    {
        public struct LocationInformation
        {
            public int Min { get; set; }
            public int Max { get; set; }
            public int Current { get; set; }
            public IEnumerable<T> List { get; set; }
        }

        private readonly IReadOnlyList<T> _items = list as IReadOnlyList<T> ?? list.ToList();
        private readonly int _disp = Math.Max(1, disp);
        private readonly int _first = Math.Max(1, first);
        private readonly TimeSpan _timeout = TimeSpan.FromMinutes(Math.Max(1, time));
        private readonly Func<IEnumerable<T>, LocationInformation, Embed> _redraw = redraw;

        private readonly IEmote _left =
            lEmote is not null ? lEmote : new Emoji("◀️");
        private readonly IEmote _right =
            rEmote is not null ? rEmote : new Emoji("▶️");

        private int TotalPages => Math.Max(1, (int)Math.Ceiling(_items.Count / (double)_disp));

        private (int start, int count, int uiMin, int uiMax) PageWindow(int page1Based)
        {
            var page = Math.Clamp(page1Based, 1, TotalPages);
            int start = (page - 1) * _disp;
            int count = Math.Max(0, Math.Min(_disp, _items.Count - start));
            int uiMin = count == 0 ? 0 : start;
            int uiMax = count == 0 ? 0 : start + count - 1;
            return (start, count, uiMin, uiMax);
        }

        public async Task SendAsync(ISocketMessageChannel channel)
        {
            if (_items.Count == 0)
            {
                var empty = new EmbedBuilder()
                    .WithTitle("Nothing to display")
                    .WithDescription("This list is empty.")
                    .WithColor(new Color(255, 179, 255))
                    .Build();

                await channel.SendMessageAsync(embed: empty);
                return;
            }

            int currentPage = Math.Clamp(_first, 1, TotalPages);
            var (start, count, uiMin, uiMax) = PageWindow(currentPage);
            var slice = _items.Skip(start).Take(count);

            var embed = _redraw(slice, new LocationInformation
            {
                Min = uiMin,
                Max = uiMax,
                Current = currentPage,
                List = _items
            });

            var msg = await channel.SendMessageAsync(embed: embed);

            // Left
            msg.AddReactionHandler(_left, user =>
            {
                if (allowedUserId.HasValue && user.Id != allowedUserId.Value) return;
                if (currentPage <= 1) return;

                currentPage--;

                var (s, c, uMin, uMax) = PageWindow(currentPage);
                var pageSlice = _items.Skip(s).Take(c);
                var e = _redraw(pageSlice, new LocationInformation
                {
                    Min = uMin,
                    Max = uMax,
                    Current = currentPage,
                    List = _items
                });

                _ = msg.ModifyAsync(m => m.Embed = e);
            }, _timeout);

            // Right
            msg.AddReactionHandler(_right, user =>
            {
                if (allowedUserId.HasValue && user.Id != allowedUserId.Value) return;
                if (currentPage >= TotalPages) return;

                currentPage++;

                var (s, c, uMin, uMax) = PageWindow(currentPage);
                var pageSlice = _items.Skip(s).Take(c);
                var e = _redraw(pageSlice, new LocationInformation
                {
                    Min = uMin,
                    Max = uMax,
                    Current = currentPage,
                    List = _items
                });

                _ = msg.ModifyAsync(m => m.Embed = e);
            }, _timeout);
        }

    }
}
