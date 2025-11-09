# ✅ AngelBot Project Checklist (TODO.md)

This checklist tracks all essential setup, development, and deployment tasks for **AngelBot** — including both the **C# backend** and **React (Vite) dashboard frontend**.

---

## 🌙 1️⃣ Core Project Setup

- [x] Create GitHub repository (`AngelBot`)
- [x] Initialize `.gitignore` and `.env` handling
- [x] Generate SSH key and add to GitHub
- [x] Clone repo via SSH
- [x] Setup folder structure:
  ```
  AngelBot/
  ├── AngelBot/ (C# backend)
  └── angeldashboard/ (React frontend)
  ```
- [x] Add `README.md`
- [x] Add `.gitattributes` for consistent line endings
- [x] Add `TODO.md` for project tracking

---

## ⚙️ 2️⃣ Backend (C# / Discord.NET)

### 🧩 Environment
- [x] Install **.NET SDK 9.0+**
- [x] Install **Discord.NET 3.x**
- [x] Add **dotenv.net** for environment variables
- [x] Create `.env`:
  ```
  DISCORD_TOKEN=your_token_here
  PREFIX=a!
  ```
- [x] Test `dotnet run` successfully logs in as bot

### 🧠 Command System
- [x] Implement `ICommand` interface
- [x] Implement `Command` base class
- [x] Create `Help`, `Ping`, and sample commands
- [x] Add reflection-based loader for all commands
- [x] Add unified `Execute` handler (prefix + slash)

### 🪄 Bot Logic
- [x] Implement `DiscordEventHandler` for:
  - [x] Command registration  
  - [x] Slash command support  
  - [x] Message listener  
- [x] Create `ReactionHandler` for emoji interactions
- [x] Add `ListingBuilder` for paginated embeds
- [ ] Implement error handling + logging system
- [ ] Add database handler (optional future feature)
- [ ] Add developer-only commands (for admin panel)

### 🧪 Testing
- [x] Run commands locally and verify responses
- [x] Test help embed displays correctly
- [x] Test reaction-based navigation
- [ ] Verify slash commands sync globally
- [ ] Write automated command tests (future)

---

## 🌐 3️⃣ Frontend (React Dashboard)

### 🧩 Environment
- [x] Install **Node.js 22.12+**
- [x] Run `npm install`
- [x] Create `.env`:
  ```
  VITE_API_URL=http://localhost:8000
  ```
- [x] Run development server (`npm run dev`)
- [x] Confirm dashboard loads at [http://localhost:5173](http://localhost:5173)

### 🎨 UI / UX
- [x] Setup TailwindCSS (if used)
- [ ] Add responsive layout
- [ ] Add light/dark theme toggle
- [ ] Create reusable components:
  - [ ] Sidebar navigation  
  - [ ] Command list view  
  - [ ] Settings modal  

### ⚙️ API Integration
- [ ] Connect dashboard to backend endpoints
- [ ] Display bot status and command data
- [ ] Add real-time event logging (optional WebSocket)
- [ ] Add configuration sync between dashboard and bot

### 🧰 Build & Deployment
- [x] Build static files (`npm run build`)
- [ ] Host `/dist` on web server (e.g. Netlify, Vercel, or local)
- [ ] Configure production environment variables

---

## 📦 4️⃣ Git & Version Control

- [x] Initialize repository with `.gitignore`
- [x] Commit initial backend code
- [x] Commit dashboard project
- [x] Add full documentation (`README_FULL.md`)
- [x] Stage + commit all files (`git add .`)
- [x] Push to GitHub (`git push origin main`)
- [ ] Set up branches:
  - [ ] `main` (stable)
  - [ ] `dev` (testing)
  - [ ] `feature/...` (new modules)

---

## 🧠 5️⃣ Documentation

- [x] Create `README.md` for backend
- [x] Add dashboard setup guide
- [x] Add setup instructions for both parts
- [x] Add SSH setup tutorial
- [x] Add troubleshooting section
- [x] Create this `TODO.md` checklist
- [ ] Add future roadmap / changelog
- [ ] Add contribution guidelines (optional)

---

## 🌍 6️⃣ Future Enhancements

- [ ] Implement Docker Compose for unified setup
- [ ] Add PostgreSQL or SQLite integration
- [ ] Add web socket event bridge between dashboard & bot
- [ ] Create authentication system for dashboard
- [ ] Add role-based command permissions
- [ ] Add analytics and logs view
- [ ] Deploy to VPS or cloud instance

---

> 🌙 *“One bot, two hearts — the code and the interface beating in sync.”*
