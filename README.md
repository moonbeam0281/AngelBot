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

## 🧩 Dependencies

| Dependency | Version | Description |
|-------------|----------|--------------|
| [.NET SDK](https://dotnet.microsoft.com/en-us/download) | 8.0+ | Required runtime |
| [Discord.NET](https://github.com/discord-net/Discord.Net) | 3.x | Discord API wrapper |
| [dotenv.net](https://github.com/tonerdo/dotenv) | latest | Loads `.env` variables |
| System.Linq / Reflection | built-in | Command auto-loading |
| Discord token | — | Required in `.env` |

---

## ⚙️ Installation

### 1️⃣ Clone the repository

If you’ve set up SSH (recommended):
```bash
git clone git@github.com:YourUser/AngelBot.git
```

Or with HTTPS:
```bash
git clone https://github.com/YourUser/AngelBot.git
```

Then enter the folder:
```bash
cd AngelBot
```

---

### 2️⃣ Restore dependencies
```bash
dotnet restore
```

---

### 3️⃣ Create a `.env` file

Create a file named `.env` in the project root (same folder as `.csproj`):
```
DISCORD_TOKEN=your_bot_token_here
PREFIX=a!
```

> 📝 The `.env` file is ignored by Git — keep your token safe!

---

### 4️⃣ Build & run the bot
```bash
dotnet build
dotnet run
```

If successful, you’ll see:
```
✅ Logged in as AngelBot#1234
```

---

## 📂 Folder Structure

```
AngelBot/
│
├── Classes/
│   └── Command.cs                 # Base command class
│
├── Commands/
│   ├── Help.cs                    # Help command
│   ├── Ping.cs                    # Example command
│
├── Handlers/
│   ├── EventHandler.cs            # Registers commands and events
│   ├── ReactionHandler.cs         # Handles reactions
│   └── ListingBuilder.cs          # Paginated embed listings
│
├── Interfaces/
│   ├── ICommand.cs                # Base command interface
│   └── IPreLoad.cs                # (optional) pre-load logic
│
├── .env                           # Environment variables (ignored by Git)
├── .env.example                   # Example environment template
├── AngelBot.csproj                # Project file
└── Program.cs                     # Main entry point
```

---

## 🧠 Command System

Each command inherits from `Command` and defines its name, description, and run logic.  
Example:

```csharp
class Ping : Command
{
    public Ping() : base("ping") { }

    public override EmbedBuilder HelpString()
        => new EmbedBuilder()
           .WithTitle("Ping Command")
           .WithDescription("Replies with 'Pong!'");

    public override async Task Run(SocketMessage msg, DiscordSocketClient client, string prefix, string cmd, string[] args)
        => await msg.Channel.SendMessageAsync("Pong!");
}
```

To add a new command:
1. Create a `.cs` file in `/Commands/`
2. Inherit from `Command`
3. Define `HelpString()` and `Run()`
4. Done! It auto-registers on startup.

---

## 🎮 Reaction & Listing System

### ReactionHandler
Attach callbacks to emoji reactions on messages:
```csharp
await message.AddReactionHandler(emoji, user => {
    Console.WriteLine($"{user.Username} reacted!");
}, TimeSpan.FromMinutes(5));
```

### ListingBuilder
Easily create paginated embed lists:
```csharp
var builder = new ListingBuilder<string>(
    list: myItems,
    redraw: (pageItems, info) => new EmbedBuilder()
        .WithTitle($"Page {info.Current}")
        .WithDescription(string.Join("\n", pageItems))
        .Build()
);
await builder.SendAsync(channel);
```

---

## 🔐 Environment Variables

| Key | Description |
|-----|-------------|
| `DISCORD_TOKEN` | Your bot’s token from the Discord Developer Portal |
| `PREFIX` | Command prefix (default: `a!`) |

---

## 💻 Running on Another Laptop

1. Install **.NET SDK 8+**  
2. Clone your repository (via SSH or HTTPS)  
3. Run:
   ```bash
   dotnet restore
   dotnet run
   ```
4. Add your `.env` file again (tokens aren’t stored in Git)
5. Done ✅

---

## 🧰 Troubleshooting

| Issue | Solution |
|--------|-----------|
| `CS0052` “inconsistent accessibility” | Make `ICommand` public |
| Bot won’t start | Check your `.env` for correct token |
| Slash commands not syncing | Ensure `await client.Rest.StartAsync()` includes your guilds |
| Reaction events not firing | Make sure `MessageContent` intent is enabled in Discord Developer Portal |

---

## 🪄 Developer Info

- **Language:** C# (.NET 8)
- **Framework:** Discord.NET
- **Environment:** dotenv + reflection system
- **Author:** Moonbeam 🌙  
- **License:** MIT (optional — add if desired)

---

> “Every command carries a little bit of Angel’s light.” ✨
