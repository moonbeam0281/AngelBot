# 🚀 AngelBot — Phase II Plan
**Goals:** Add a database, containerize everything with Docker Compose, and enable bot → dashboard updates via a request handler (REST first; WebSocket later).

---

## ✅ Outcomes
- PostgreSQL database running in Docker with persistent volume
- C# backend (AngelBot) connected to PostgreSQL via `Npgsql` (+ optional `Dapper`)
- React dashboard running via Vite with an API receiver for bot updates
- `docker-compose.yml` orchestrating **bot**, **dashboard**, and **db**
- Clear `.env` contracts for local + containerized runs
- REST-based Request Handler from Bot → Dashboard (WebSocket optional next)

---

## 🔐 Environment Variables (contracts)

### Backend (`AngelBot/.env`)
```
DISCORD_TOKEN=your_bot_token_here
DB_CONNECTION=Host=postgres;Port=5432;Database=angelbot;Username=angel;Password=secret;
DASHBOARD_URL=http://dashboard:8000
```

> Note: In Docker, the host `postgres` and `dashboard` match the **service names** in `docker-compose.yml`.

### Dashboard (`angeldashboard/.env`)
```
VITE_API_URL=http://localhost:8000
PORT=8000
```

> For Docker, the dashboard service will expose `8000` to the host. Vite dev may still serve on `5173` locally.

---

## 🧱 Docker Compose (top-level `docker-compose.yml`)

```yaml
version: "3.9"

services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: angel
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: angelbot
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./AngelBot/SQL/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - angelnet

  bot:
    build: ./AngelBot
    depends_on:
      - db
    env_file:
      - ./AngelBot/.env
    volumes:
      - ./AngelBot:/app
    networks:
      - angelnet

  dashboard:
    build: ./angeldashboard
    env_file:
      - ./angeldashboard/.env
    ports:
      - "5173:5173"  # Vite dev (optional) 
      - "8000:8000"  # API receiver
    volumes:
      - ./angeldashboard:/app
    networks:
      - angelnet

networks:
  angelnet:
    driver: bridge

volumes:
  db_data:
```

---

## 🐳 Dockerfiles

### Backend (`AngelBot/Dockerfile`)
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# Runtime stage
FROM mcr.microsoft.com/dotnet/runtime:9.0
WORKDIR /app
COPY --from=build /out .
# The bot uses .env via dotenv.net (or pass ENV directly)
ENTRYPOINT ["dotnet", "AngelBot.dll"]
```

### Dashboard (`angeldashboard/Dockerfile`)
```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Expose both Vite dev and API receiver
EXPOSE 5173
EXPOSE 8000
# For dev: start both Vite and API receiver via npm scripts or a small node entry
CMD ["npm", "run", "dev"]
```

> For production, you might replace Vite dev with `npm run build` and serve static files with `nginx` while the API receiver runs separately. For Phase II, dev mode is acceptable.

---

## 🧠 Backend — Database Handler (C#)

### NuGet
```bash
dotnet add package Npgsql
dotnet add package Dapper
```

### `DatabaseHandler.cs` (minimal)
```csharp
using Npgsql;
using System;

namespace AngelBot.Database
{
    public static class DatabaseHandler
    {
        private static readonly string? _conn = Environment.GetEnvironmentVariable("DB_CONNECTION");

        public static NpgsqlConnection GetConnection()
        {
            if (string.IsNullOrWhiteSpace(_conn))
                throw new InvalidOperationException("DB_CONNECTION is not set.");

            return new NpgsqlConnection(_conn);
        }
    }
}
```

### Use at startup (connectivity check)
```csharp
using var conn = AngelBot.Database.DatabaseHandler.GetConnection();
await conn.OpenAsync();
Console.WriteLine("✅ Connected to database!");
```

---

## 🗃️ SQL Bootstrap

### `AngelBot/SQL/init.sql`
```sql
CREATE TABLE IF NOT EXISTS bot_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bot_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

> Place future migrations under `AngelBot/SQL/migrations/` and apply them via a tiny migration runner or by SQL files.

---

## 🔄 Request Handler — Bot → Dashboard (REST)

### Backend (C#) sender
```csharp
using System.Net.Http;
using System.Net.Http.Json;
using System;
using System.Threading.Tasks;

public static class DashboardClient
{
    private static readonly HttpClient _http = new();

    public static async Task SendAsync(string path, object payload)
    {
        var baseUrl = Environment.GetEnvironmentVariable("DASHBOARD_URL") ?? "http://localhost:8000";
        var url = $"{baseUrl.TrimEnd('/')}{path}";
        var resp = await _http.PostAsJsonAsync(url, payload);
        resp.EnsureSuccessStatusCode();
    }
}
```

**Usage:**
```csharp
await DashboardClient.SendAsync("/api/status", new {
    online = true,
    timestamp = DateTimeOffset.UtcNow
});
```

### Dashboard receiver (Node/Express)
`angeldashboard/src/api/server.ts`:
```ts
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/status", (req, res) => {
  console.log("Bot status:", req.body);
  // TODO: funnel to UI state via in-memory store or websocket to client
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Dashboard API listening on", process.env.PORT || 8000);
});
```

> You can run this alongside Vite dev (e.g., with `concurrently`) or keep it separate. For Phase II, bundling inside the dashboard container is fine.

---

## 🔌 Optional — WebSocket Upgrade (Phase II.5)
- Use `ws` (Node) or `Socket.IO` for dashboard to receive **live** events
- Bot sends events to Node server → Node broadcasts to connected browsers
- UI subscribes and shows real-time logs/status

---

## 🧪 Test Plan
1. **DB**: run `docker-compose up db`, psql into `localhost:5432`, ensure tables exist
2. **Bot**: run `docker-compose up bot` (or local `dotnet run`), verify “✅ Connected to database!”
3. **Dashboard**: run `docker-compose up dashboard`, hit `http://localhost:8000/api/status` with Postman → `200 OK`
4. **End-to-end**: trigger a bot action → see payload printed on dashboard server

---

## 🛡️ Security Notes
- Never commit `.env` with tokens/passwords
- In production, use secrets manager or Docker secrets
- Restrict dashboard receiver (auth token on bot → dashboard POST)
- Rate-limit and validate payloads server-side

---

## 📋 Phase II Tasks (checklist)

### Database
- [ ] Add `Npgsql` + `Dapper` packages
- [ ] Implement `DatabaseHandler.cs`
- [ ] Add `SQL/init.sql` and apply on container start
- [ ] Add sample query + connectivity log on bot start

### Docker
- [ ] Add `Dockerfile` for bot
- [ ] Add `Dockerfile` for dashboard
- [ ] Add `docker-compose.yml`
- [ ] Test `docker-compose up --build`

### Request Handler
- [ ] Implement `DashboardClient.SendAsync(path, payload)` in bot
- [ ] Create `src/api/server.ts` in dashboard
- [ ] Wire API to UI state (simple store)
- [ ] Add auth token validation (env-based)

### Documentation
- [ ] Update README with Docker + DB + Request Handler sections
- [ ] Add `.env.example` for both services

---

> 🌙 *Phase II turns AngelBot into a truly connected, portable, and persistent platform.*
