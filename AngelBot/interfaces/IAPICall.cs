using System.Net;
using Discord.WebSocket;

namespace AngelBot.Interfaces
{
    public class ApiEndpointInfo
    {
        public required string Path { get; init; }
        public string Method { get; init; } = "GET";
        public string? Description { get; init; }
        public bool Visible { get; init; } = true;
    }

    public interface IApiEndpoint
    {
        ApiEndpointInfo Info {get;}

        Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client);
    }
}