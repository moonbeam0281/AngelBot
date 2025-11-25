import { useBotInfo } from "../../context/BotInfoContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardHome() {
    const { botInfo, loading, error } = useBotInfo();
    const { user } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-sm opacity-80">
                    <div
                        className="
                            h-10 w-10
                            rounded-full
                            border-2 border-(--accent)
                            border-t-transparent
                            animate-spin
                        "
                    />
                    <span>Loading bot info…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="
                text-sm
                text-red-300
                bg-[rgba(80,20,36,0.6)]
                border border-[rgba(255,155,155,0.6)]
                rounded-md px-3 py-2
            ">
                Error: {error}
            </div>
        );
    }

    if (!botInfo) {
        return <div className="text-sm opacity-75">No bot data.</div>;
    }

    const totalCommands = botInfo.commands?.length ?? 0;
    const hiddenCommands = botInfo.commands?.filter(c => c.visibleInHelp === false).length ?? 0;
    const visibleCommands = totalCommands - hiddenCommands;
    const categories = Array.from(new Set(botInfo.commands?.map(c => c.category) ?? []));
    const isOnline = botInfo.status === "Connected";

    // Theme-aware panel
    const panelClasses =
        theme === "dark"
            ? "bg-[var(--bg-soft)] border-[rgba(135,206,255,0.25)] shadow-[0_0_14px_rgba(5,12,30,0.6)]"
            : "bg-[var(--bg-soft)] border-[rgba(255,183,213,0.6)] shadow-[0_0_14px_rgba(255,183,213,0.35)]";

    const badgeClasses =
        theme === "dark"
            ? "bg-[rgba(9,15,28,0.95)] border-[rgba(135,206,255,0.45)]"
            : "bg-[rgba(255,240,247,0.9)] border-[rgba(255,183,213,0.7)]";

    return (
        <div className="flex flex-col gap-8 text-(--text-main) select-none">

            {/* HEADER */}
            <header className="flex flex-col gap-2">
                <h1 className="text-[2rem] font-bold angel-gradient-text">
                    Dashboard Overview
                </h1>

                <p className="text-[0.95rem] opacity-85">
                    Welcome back{user ? `, ${user.username}` : ""}.{" "}
                    Here’s how <span className="text-(--accent-soft) font-semibold">
                        {botInfo.name}
                    </span>{" "}
                    is doing.
                </p>

                <div
                    className={`
                        mt-2 inline-flex items-center gap-2
                        rounded-full border px-3 py-1.5
                        text-[0.8rem]
                        ${badgeClasses}
                    `}
                >
                    <span
                        className={`
                            h-2.5 w-2.5 rounded-full
                            ${isOnline ? "bg-[#4ade80]" : "bg-[#f97373]"}
                        `}
                    />
                    <span>{botInfo.status}</span>
                </div>
            </header>

            {/* TOP STATS */}
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {/* Servers */}
                <div className={`rounded-xl p-4 border ${panelClasses}`}>
                    <span className="text-[0.85rem] opacity-80">Servers</span>
                    <div className="text-[1.6rem] font-semibold">
                        {botInfo.serverCount}
                    </div>
                    <span className="text-[0.75rem] opacity-70">
                        Guilds connected
                    </span>
                </div>

                {/* Users */}
                <div className={`rounded-xl p-4 border ${panelClasses}`}>
                    <span className="text-[0.85rem] opacity-80">Users</span>
                    <div className="text-[1.6rem] font-semibold">
                        {botInfo.userCount}
                    </div>
                    <span className="text-[0.75rem] opacity-70">
                        Users tracked
                    </span>
                </div>

                {/* Commands */}
                <div className={`rounded-xl p-4 border ${panelClasses}`}>
                    <span className="text-[0.85rem] opacity-80">Commands</span>
                    <div className="text-[1.6rem] font-semibold">
                        {totalCommands}
                    </div>
                    <span className="text-[0.75rem] opacity-70">
                        {visibleCommands} visible · {hiddenCommands} hidden
                    </span>
                </div>
            </section>

            {/* CATEGORIES + BOT INFO */}
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">

                {/* COMMAND CATEGORIES */}
                <div>
                    <h2 className="mb-2 text-[1.25rem] font-semibold angel-gradient-text">
                        Command Categories
                    </h2>

                    {categories.length === 0 ? (
                        <p className="text-[0.85rem] opacity-75">
                            No commands registered.
                        </p>
                    ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <span
                                    key={cat}
                                    className={`
                                        rounded-full border px-3 py-1
                                        text-[0.8rem]
                                        category-${cat}
                                        ${theme === "dark" ?
                                            "bg-[rgba(10,18,32,0.95)] border-[rgba(135,206,255,0.35)]" :
                                            "bg-[#fff3fb] border-[rgba(255,183,213,0.6)]"}
                                    `}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOT INFORMATION */}
                <div>
                    <h2 className="mb-2 text-[1.25rem] font-semibold angel-gradient-text">
                        Bot Information
                    </h2>

                    <p className="text-[0.85rem] opacity-80 leading-relaxed">
                        • Name: {botInfo.name}
                        <br />
                        • Status: {botInfo.status}
                        <br />
                        • Avatar & banner loaded
                    </p>
                </div>
            </section>
        </div>
    );
}
