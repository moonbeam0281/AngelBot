# 🌙 AngelBot

**AngelBot** is a modular Discord bot built with **C# (.NET 8)** and **Discord.NET**.  
It supports both **prefix** (`a!ping`) and **slash** (`/ping`) commands, unified through a reflection-based command system.  
The bot architecture is designed for easy expansion — just add new command classes in the `/commands` folder and they’ll auto-register.

---

## ✨ Features

- Unified **Command System** (prefix & slash)
- Reflection-based **auto-loading**
- Modular **Handlers**
  - `EventHandler` for command discovery
  - `ReactionHandler` for reaction events
  - `ListingBuilder` for paginated embeds
- `.env` configuration support (via **dotenv.net**)
- Beautiful **embed-based help system**
- Cross-context execution (`SocketMessage` / `SocketInteraction`)


---

# ⚙️ Setup Guide

AngelBot is split into **two main parts**:

1. **AngelBot (C# Discord backend)** — runs the Discord bot.
2. **AngelDashboard (React frontend)** — manages and monitors the bot via a web dashboard.

---

## 🪄 1️⃣ AngelBot Setup (C# Backend)

### 📦 Requirements
| Dependency | Version | Purpose |
|-------------|----------|----------|
| [.NET SDK](https://dotnet.microsoft.com/en-us/download) | 9.0+ | Required runtime |
| [Discord.NET](https://github.com/discord-net/Discord.Net) | 3.x | Discord API library |
| [dotenv.net](https://github.com/tonerdo/dotenv) | latest | Load environment variables |

---

### 🧩 Steps

#### 1. Restore dependencies
```bash
dotnet restore
```

#### 2. Create a `.env` file
In the project root:
```
DISCORD_TOKEN=your_bot_token_here
PREFIX=a!
```

#### 3. Build & run
```bash
dotnet build
dotnet run
```

If successful, you’ll see:
```
✅ Logged in as AngelBot#1234
```

#### 4. (Optional) Development mode
Use:
```bash
dotnet watch run
```
This automatically restarts the bot when you change code.

---

## 🌐 2️⃣ AngelDashboard Setup (React Frontend)

### 📦 Requirements
| Dependency | Version | Purpose |
|-------------|----------|----------|
| [Node.js](https://nodejs.org/en/download) | 22.12+ (or 20.19+) | Required for Vite |
| [npm](https://www.npmjs.com/) | 10.x | Package manager |
| [Vite](https://vitejs.dev/) | latest | Frontend bundler |

---

### 🧩 Steps

#### 1. Move into dashboard folder
```bash
cd angeldashboard
```

#### 2. Restore dependencies
```bash
npm install
```

If you previously used Yarn:
```bash
yarn install
```

#### 3. Create `.env`
If your dashboard communicates with the bot’s API:
```
VITE_API_URL=http://localhost:8000
```

*(You can change the port depending on your C# backend settings.)*

#### 4. Start the development server
```bash
npm run dev
```

You’ll see:
```
VITE v5.x.x  ready in 200ms
Local: http://localhost:5173/
```

Open your browser at that address.

---

### 💡 Common Issues

| Problem | Cause | Fix |
|----------|--------|-----|
| `Vite requires Node.js 20.19+` | Outdated Node.js | Update Node to v22+ from [nodejs.org](https://nodejs.org/en/download) |
| `crypto.hash is not a function` | Old Node version (v19 or lower) | Upgrade Node.js |
| Dashboard not connecting | Wrong API URL | Check your `.env` and C# backend port |

---

## 💫 Quick Run Summary

| Service | Command | Description |
|----------|----------|-------------|
| 🧩 AngelBot | `dotnet run` | Launches Discord backend |
| 🌐 Dashboard | `npm run dev` | Starts frontend server |
| 🔄 Dev Mode (bot) | `dotnet watch run` | Auto-reload C# changes |
| ⚙️ Build Dashboard | `npm run build` | Creates production build |

---

## 💻 Deployment Notes
- Keep both `.env` files out of Git (`.gitignore` already includes them).
- When moving to another PC:
  1. Restore .NET SDK 9.0+
  2. Restore Node.js 22+
  3. Clone repo
  4. Run `dotnet restore` and `npm install` again
  5. Add `.env` files manually
- For production, host the dashboard build (`/dist`) on any static web host and keep the bot running as a background service.

---

> 🌙 *“Two halves of one system — Angel’s light guiding both code and interface.”*
