using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
using Discord;
using Discord.WebSocket;

namespace AngelBot.APIServices
{
    public class ApiServer
    {
        public string prefixPort;
        private readonly Dictionary<(string Path, string Method), IApiEndpoint> _routes = [];
        internal DiscordEventHandler DiscordHandler { get; set; }
        private readonly HttpListener listener = new();
        private readonly DiscordSocketClient _client;

        public ApiServer(DiscordEventHandler handler, DiscordSocketClient client)
        {
            DiscordHandler = handler;
            _client = client;

            var endpoints = GlobalFunctions.GetAllTypes<IApiEndpoint>().Select(t => (ApiEndpoint)Activator.CreateInstance(t)!).ToArray();

            foreach (var ep in endpoints)
            {
                var key = (ep.Info.Path.ToLowerInvariant(), ep.Info.Method.ToUpperInvariant());
                _routes[key] = ep;
                Console.WriteLine($"[API] Registered {ep.Info.Method} {ep.Info.Path}");
            }

            _ = int.TryParse(Environment.GetEnvironmentVariable("API_PORT"), out var port);

            prefixPort = $"http://localhost:{port}/";
            listener.Prefixes.Add(prefixPort);

            Console.WriteLine($"[API] Added prefix: {prefixPort}");
        }


        public void Start()
        {
            listener.Start();

            Console.WriteLine($"[API] Listening on {prefixPort}");

            _ = Task.Run(async () =>
            {
                try
                {
                    while (listener.IsListening)
                    {
                        var context = await listener.GetContextAsync();
                        _ = Task.Run(async () =>
                        {
                            await HandleRequestAsync(context);
                            Console.WriteLine($"[{context.Request.HttpMethod}]:{context.Request.Url} was called...");
                        });
                    }
                }
                catch (ObjectDisposedException)
                {

                }
            });
        }

        private async Task HandleRequestAsync(HttpListenerContext ctx)
        {
            var path = ctx.Request.Url?.AbsolutePath?.ToLowerInvariant() ?? "/";
            var method = ctx.Request.HttpMethod.ToUpperInvariant();
            if (path == "/favicon.ico")
            {
                ctx.Response.StatusCode = 204;
                ctx.Response.Close();
                return;
            }

            if (method == "OPTIONS")
            {
                ctx.Response.StatusCode = 204;
                ctx.Response.Close();
                return;
            }

            var key = (path, method);

            if (_routes.TryGetValue(key, out var endpoint))
            {
                await endpoint.HandleAsync(ctx, _client);
                return;
            }

            ctx.Response.StatusCode = 404;
            ctx.Response.ContentType = "text/plain";
            using var writer = new StreamWriter(ctx.Response.OutputStream);
            await writer.WriteAsync("Not found");
            ctx.Response.Close();
        }
    }
}