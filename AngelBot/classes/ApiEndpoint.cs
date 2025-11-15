using System.Net;
using System.Text;
using System.Text.Json;
using AngelBot.Interfaces;
using Discord.WebSocket;

namespace AngelBot.Classes
{
    public abstract class ApiEndpoint(ApiEndpointInfo info) : IApiEndpoint
    {
        public ApiEndpointInfo Info { get; } = info;

        public abstract Task HandleAsync(HttpListenerContext ctx, DiscordSocketClient client);
        public virtual async Task Json(HttpListenerResponse response, object data, int statusCode = 200)
        {
            response.StatusCode = statusCode;
            response.ContentType = "application/json; charset=utf-8";

            var json = JsonSerializer.Serialize(data);

            var bytes = Encoding.UTF8.GetBytes(json);
            response.ContentLength64 = bytes.Length;
            await response.OutputStream.WriteAsync(bytes);
            response.Close();
        }

        public virtual void ApplyCors(HttpListenerResponse response)
        {
            response.Headers["Access-Control-Allow-Origin"] = "*";
            response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
            response.Headers["Access-Control-Allow-Headers"] = "Content-Type";
        }
    }
}
