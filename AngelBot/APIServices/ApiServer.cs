using System.Net;
using AngelBot.Classes;
using AngelBot.Handlers;
using AngelBot.Interfaces;
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

            var portStr = Environment.GetEnvironmentVariable("API_PORT");
            if (!int.TryParse(portStr, out var port) || port <= 0 || port > 65535)
            {
                port = 5005;
                Console.WriteLine($"[API] API_PORT missing or invalid ('{portStr}'), defaulting to {port}.");
            }

            prefixPort = $"http://+:{port}/";
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
                var appEnv = Environment.GetEnvironmentVariable("APP_ENV") ?? "Development";
                var frontEndUrl = Environment.GetEnvironmentVariable("FRONT_END_URL")
                                   ?? (appEnv == "Production"
                                       ? "http://localhost:8080"
                                       : "http://localhost:5173");
                ctx.Response.StatusCode = 204;

                ctx.Response.Headers["Access-Control-Allow-Origin"] = frontEndUrl;
                ctx.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
                ctx.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
                ctx.Response.Headers["Access-Control-Allow-Credentials"] = "true";

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