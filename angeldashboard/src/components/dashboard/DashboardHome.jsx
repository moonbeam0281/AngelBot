import { useBotInfo } from "../../context/BotInfoContext";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
    const { botInfo, loading, error } = useBotInfo();
    const { user } = useAuth();

    if (loading) return <div className="dashhome-loading">Loading bot info…</div>;
    if (error) return <div className="dashhome-error">Error: {error}</div>;
    if (!botInfo) return <div className="dashhome-empty">No bot data.</div>;

    const totalCommands = botInfo.commands?.length ?? 0;
    const hiddenCommands = botInfo.commands?.filter(c => c.visibleInHelp === false).length ?? 0;
    const visibleCommands = totalCommands - hiddenCommands;

    const categories = Array.from(
        new Set(botInfo.commands?.map(c => c.category) ?? [])
    );

    return (
        <div className="dashhome">
            <header className="dashhome-header">
                <h1 className="dashhome-title">Dashboard Overview</h1>
                <p className="dashhome-subtitle">
                    Welcome back{user ? `, ${user.username}` : ""}.
                    Here’s how <span className="dashhome-botname">{botInfo.name}</span> is doing.
                </p>

                <div className="dashhome-status-pill">
                    <span className={`status-dot ${botInfo?.status === "Connected" ? "online" : "offline"}`}></span>
                    {botInfo?.status}
                </div>
            </header>

            <section className="dashhome-grid">
                <div className="dashhome-card">
                    <span className="dashhome-card-label">Servers</span>
                    <span className="dashhome-card-value">{botInfo.serverCount}</span>
                    <span className="dashhome-card-sub">Guilds connected</span>
                </div>

                <div className="dashhome-card">
                    <span className="dashhome-card-label">Users</span>
                    <span className="dashhome-card-value">{botInfo.userCount}</span>
                    <span className="dashhome-card-sub">Users tracked</span>
                </div>

                <div className="dashhome-card">
                    <span className="dashhome-card-label">Commands</span>
                    <span className="dashhome-card-value">{totalCommands}</span>
                    <span className="dashhome-card-sub">
                        {visibleCommands} visible · {hiddenCommands} hidden
                    </span>
                </div>
            </section>

            <section className="dashhome-lower">
                <div className="dashhome-block">
                    <h2>Command Categories</h2>

                    {categories.length === 0 ? (
                        <p className="dashhome-muted">No commands registered.</p>
                    ) : (
                        <div className="dashhome-category-chips">
                            {categories.map(cat => (
                                <span
                                    key={cat}
                                    className={`dashhome-category-chip category-${cat}`}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashhome-block">
                    <h2>Bot Information</h2>
                    <p className="dashhome-muted">
                        • Name: {botInfo.name}<br />
                        • Status: {botInfo.status}<br />
                        • Latency: {botInfo.latency}ms<br />
                        • Avatar & banner loaded
                    </p>
                </div>
            </section>
        </div>
    );
}
