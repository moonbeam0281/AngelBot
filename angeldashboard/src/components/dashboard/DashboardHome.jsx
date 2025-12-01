import { useBotInfo } from "../../context/BotInfoContext";
import { useAuth } from "../../context/AuthContext";
import { useStyles } from "../../context/StyleContext.jsx";

export default function DashboardHome() {
    const { botInfo, loading, error } = useBotInfo();
    const { user } = useAuth();
    const { styles, getGradientText } = useStyles();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-sm opacity-80">
                    <div
                        className="
                            h-10 w-10
                            rounded-full
                            border-2 border-(--btn-border-primary)
                            border-t-transparent
                            animate-spin
                        "
                    />
                    <span className={styles.text.base}>Loading bot info…</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="
                    text-sm
                    text-[#fecaca]
                    bg-[rgba(80,20,36,0.6)]
                    border border-[rgba(248,113,113,0.6)]
                    rounded-md px-3 py-2
                "
            >
                Error: {error}
            </div>
        );
    }

    if (!botInfo) {
        return (
            <div className="text-sm opacity-75">
                No bot data.
            </div>
        );
    }

    const totalCommands = botInfo.commands?.length ?? 0;
    const hiddenCommands =
        botInfo.commands?.filter((c) => c.visibleInHelp === false).length ?? 0;
    const visibleCommands = totalCommands - hiddenCommands;
    const categories = Array.from(
        new Set(botInfo.commands?.map((c) => c.category) ?? [])
    );
    const isOnline = botInfo.status === "Connected";

    // panel for stats
    const panelClasses = `
        rounded-xl p-4 border
        bg-[var(--bg-soft)]
        border-[var(--angel-border-soft)]
        shadow-[var(--angel-shadow-strong)]
    `;

    //IMPORTANT NOTICE: REWORK THIS COMPONENT ONCE FINISHD WITH COMMANDS

    return (
        <div className="flex flex-col gap-8 select-none">
            {/* HEADER */}
            <header className="flex flex-col gap-2">
                <h1
                    className={getGradientText(
                        "soft",
                        "text-[2rem] font-extrabold mb-1 text-center"
                    )}
                >
                    Dashboard Overview
                </h1>

                <p
                    className={`${styles.text.base} text-[0.95rem] opacity-85`}
                >
                    Welcome back
                    {user ? `, ${user.username}` : ""}.{" "}
                    Here’s how{" "}
                    <span className="text-(--accent-soft) font-semibold">
                        {botInfo.name}
                    </span>{" "}
                    is doing.
                </p>

                <div
                    className={`
                        mt-2 inline-flex items-center gap-2
                        rounded-full border px-3 py-1.5
                        text-[0.8rem]
                        bg-(--bg-soft)
                        border-(--btn-border-soft)
                    `}
                >
                    <span
                        className={`
                            h-2.5 w-2.5 rounded-full
                            ${isOnline ? "bg-[#4ade80]" : "bg-[#f97373]"}
                        `}
                    />
                    <span className={styles.text.base}>{botInfo.status}</span>
                </div>
            </header>

            {/* TOP STATS */}
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Servers */}
                <div className={styles.stats.panel}>
                    <span className={styles.stats.label}>Servers</span>
                    <div className={styles.stats.value}>{botInfo.serverCount}</div>
                    <span className={styles.stats.hint}>Guilds connected</span>
                </div>

                {/* Users */}
                <div className={panelClasses}>
                    <span className="text-[0.85rem] opacity-80">Users</span>
                    <div className="text-[1.6rem] font-semibold">
                        {botInfo.userCount}
                    </div>
                    <span className="text-[0.75rem] opacity-70">
                        Users tracked
                    </span>
                </div>

                {/* Commands */}
                <div className={panelClasses}>
                    <span className="text-[0.85rem] opacity-80">
                        Commands
                    </span>
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
                    <h2
                        className={getGradientText(
                            "soft",
                            "mb-2 text-[1.25rem] font-semibold"
                        )}
                    >
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
                                        bg-(--bg-soft)
                                        border-(--btn-border-soft)
                                        category-${cat}
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
                    <h2
                        className={getGradientText(
                            "soft",
                            "mb-2 text-[1.25rem] font-semibold"
                        )}
                    >
                        Bot Information
                    </h2>

                    <p className="text-[0.85rem] opacity-80 leading-relaxed">
                        • Name: {botInfo.name}
                        <br />
                        • Status: {botInfo.status}
                        <br />
                        • Avatar &amp; banner loaded
                    </p>
                </div>
            </section>
        </div>
    );
}
