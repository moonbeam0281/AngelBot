import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useBotInfo } from "../../context/BotInfoContext";
import { useStyles } from "../../context/StyleContext.jsx";

export default function SideBar() {
    const { botInfo } = useBotInfo();
    const { styles } = useStyles();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const bannerStyle = botInfo?.banner
        ? { backgroundImage: `url(${botInfo.banner})` }
        : {};

    const items = [
        { label: "Home", path: "/dashboard", icon: "🏠" },
        { label: "Guilds", path: "/dashboard/guilds", icon: "🛡️" },
        { label: "Commands", path: "/dashboard/commands", icon: "⚙️" },
        { label: "Settings", path: "/dashboard/settings", icon: "🔧" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`
                ${styles.sidebar.container}
                transition-all duration-300 ease-out
                select-none
                ${collapsed ? "w-18" : "w-64"}
              `}
        >
            {/* BOT BANNER */}
            <div
                className="
                relative
                h-35
                border-b border-(--angel-border-soft)
                bg-cover bg-center
                overflow-hidden
                "
                style={bannerStyle}
            >
                {/* overlay */}
                <div
                    className={`
                        absolute inset-0
                        backdrop-blur-[3px]
                        ${styles.sidebar.bannerOverlay}
                    `}
                />

                <div
                    className="
                        relative z-10
                        px-3 py-5
                        flex flex-col items-center
                        "
                >
                    {botInfo && (
                        <>
                            {/* Avatar + glow ring */}
                            <div
                                className={`${styles.sidebar.avatarGlow}`}
                                style={{
                                    backgroundImage: "var(--angel-gradient-soft)",
                                    backgroundSize: "200% 200%",
                                }}
                            >
                                <img
                                    className={`${styles.sidebar.avatarImage}`}
                                    src={botInfo.avatar}
                                    alt={botInfo.name}
                                />
                            </div>

                            <div className="mt-3 text-sm font-semibold tracking-wide text-(--accent-soft) text-center">
                                {botInfo.name}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* NAV ITEMS */}
            <nav className="flex-1 px-2 py-3 space-y-2">
                {items.map((item) => {
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative group ${styles.sidebar.itemBase} ${active ? styles.sidebar.itemActive : styles.sidebar.itemInactive}`}
                        >
                            {/* ICON + ACTIVE ORB */}
                            <span className="relative flex items-center justify-center w-6 h-6">
                                {/* Glowing orb behind the icon */}
                                {active && (<span className="absolute inset-0 m-auto h-3.5 w-3.5 rounded-full bg-(--accent-soft) shadow-[0_0_10px_var(--accent-soft)]"/>)}

                                {/* The icon itself */}
                                <span className="relative z-10 text-lg">
                                    {item.icon}
                                </span>
                            </span>

                            {/* LABEL */}
                            {!collapsed && (
                                <span className="relative z-10 truncate">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* COLLAPSE BUTTON AREA */}
            <div className={styles.sidebar.footer}>
                {/* You can add status text on the left later if you want */}
                <button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    className={`${styles.sidebar.collapsedBtn}`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? "⮞" : "⮜"}
                </button>
            </div>
        </aside>
    );
}
