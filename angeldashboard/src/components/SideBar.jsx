import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useBotInfo } from "../context/BotInfoContext";
import { useTheme } from "../context/ThemeContext";

export default function SideBar() {
    const { botInfo } = useBotInfo();
    const { theme } = useTheme();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const bannerStyle = botInfo?.banner
        ? { backgroundImage: `url(${botInfo.banner})` }
        : {};

    const items = [
        { label: "Home", path: "/dashboard", icon: "🏠" },
        { label: "Guilds", path: "/dashboard/guilds", icon: "🛡️" },
        { label: "Commands", path: "/dashboard/commands", icon: "⚙️" },
        { label: "Settings", path: "/dashboard/settings", icon: "🔧" }
    ];

    const isActive = (path) => location.pathname === path;

    const asideThemeClasses =
        theme === "dark"
            ? `
                bg-[rgba(4,8,20,0.96)]
                border-r border-[rgba(135,206,255,0.25)]
                shadow-[4px_0_22px_rgba(0,0,0,0.6)]
              `
            : `
                bg-[#fff9f2]
                border-r border-[rgba(255,183,213,0.7)]
                shadow-[4px_0_18px_rgba(0,0,0,0.18)]
              `;

    const bannerOverlayClasses =
        theme === "dark"
            ? "bg-[rgba(0,0,0,0.45)]"
            : "bg-[rgba(255,255,255,0.35)]";

    const collapseButtonTheme =
        theme === "dark"
            ? `
                bg-[rgba(10,18,32,0.96)]
                hover:bg-[rgba(18,28,52,0.96)]
                border border-[rgba(135,206,255,0.6)]
                hover:border-[rgba(191,229,255,0.9)]
              `
            : `
                bg-[#ffeef7]
                hover:bg-[#ffe1f0]
                border border-[rgba(255,183,213,0.7)]
                hover:border-[rgba(255,183,213,0.95)]
              `;

    const getItemThemeClasses = (active) => {
        if (theme === "dark") {
            if (active) {
                return `
                    bg-[rgba(18,28,52,0.95)]
                    border border-[rgba(135,206,255,0.7)]
                    shadow-[0_0_16px_rgba(135,206,255,0.45)]
                `;
            }
            return `
                border border-transparent
                hover:bg-[rgba(10,18,32,0.95)]
                hover:border-[rgba(135,206,255,0.35)]
            `;
        } else {
            if (active) {
                return `
                    bg-[#ffeef7]
                    border border-[rgba(255,183,213,0.9)]
                    shadow-[0_0_14px_rgba(255,183,213,0.6)]
                `;
            }
            return `
                border border-transparent
                hover:bg-[#fff3fb]
                hover:border-[rgba(255,183,213,0.6)]
            `;
        }
    };

    const iconTheme = (active) =>
        active
            ? "text-accent-soft drop-shadow-[0_0_6px_var(--accent-soft)]"
            : "group-hover:text-accent-soft";

    const labelTheme = (active) =>
        active
            ? "text-accent-soft"
            : theme === "dark"
            ? "opacity-85 group-hover:text-accent-soft"
            : "text-[var(--text-main)] opacity-80 group-hover:text-accent-soft";

    return (
        <aside
            className={`
                flex flex-col
                transition-all duration-300 ease-out
                select-none
                ${collapsed ? "w-20" : "w-64"}
                ${asideThemeClasses}
            `}
        >
            {/* BOT BANNER */}
            <div
                className="
                    relative
                    border-b border-[rgba(135,206,255,0.18)]
                    bg-cover bg-center
                    overflow-hidden
                "
                style={bannerStyle}
            >
                <div
                    className={`
                        absolute inset-0
                        backdrop-blur-[3px]
                        ${bannerOverlayClasses}
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
                            {/* Avatar glow */}
                            <div
                                className="
                                    relative
                                    rounded-full p-[3px]
                                    bg-linear-to-br from-accent to-accent-soft
                                    shadow-[0_0_22px_var(--accent-soft)]
                                "
                            >
                                <img
                                    className="
                                        h-14 w-14 rounded-full
                                        object-cover
                                        border border-[rgba(255,255,255,0.4)]
                                        shadow-[0_0_16px_rgba(143,213,255,0.5)]
                                    "
                                    src={botInfo.avatar}
                                    alt={botInfo.name}
                                />
                            </div>

                            {!collapsed && (
                                <div className="mt-3 text-sm font-semibold tracking-wide text-accent-soft text-center">
                                    {botInfo.name}
                                </div>
                            )}

                            {collapsed && (
                                <hr className="mt-4 w-[60%] border-t border-[rgba(191,229,255,0.35)]" />
                            )}
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
                            className={`
                                relative group
                                flex items-center gap-3
                                px-3 py-2
                                rounded-lg
                                text-sm font-medium
                                transition-all duration-200
                                overflow-hidden
                                ${getItemThemeClasses(active)}
                            `}
                        >
                            {/* Hover Shine Sweep */}
                            <div
                                className="
                                    absolute inset-0 opacity-0 group-hover:opacity-100
                                    bg-linear-to-r from-transparent via-[rgba(255,255,255,0.09)] to-transparent
                                    -translate-x-full
                                    group-hover:translate-x-full
                                    transition-all duration-700
                                "
                            />

                            {/* Active glowing orb */}
                            {active && (
                                <span
                                    className="
                                        absolute left-0 top-1/2 -translate-y-1/2
                                        h-2.5 w-2.5 rounded-full
                                        bg-accent-soft
                                        shadow-[0_0_10px_var(--accent-soft)]
                                    "
                                />
                            )}

                            {/* ICON */}
                            <span
                                className={`
                                    text-lg relative z-10
                                    transition
                                    ${iconTheme(active)}
                                `}
                            >
                                {item.icon}
                            </span>

                            {/* LABEL */}
                            {!collapsed && (
                                <span
                                    className={`
                                        relative z-10
                                        transition
                                        ${labelTheme(active)}
                                    `}
                                >
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* COLLAPSE BUTTON */}
            <div className="mt-auto px-2 py-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setCollapsed((prev) => !prev)}
                    className={`
                        flex items-center justify-center
                        h-9 w-9
                        rounded-full
                        text-accent-soft
                        shadow-[0_0_12px_rgba(135,206,255,0.4)]
                        transition
                        hover:shadow-[0_0_18px_var(--accent-soft)]
                        cursor-pointer
                        ${collapseButtonTheme}
                    `}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? "⮞" : "⮜"}
                </button>
            </div>
        </aside>
    );
}
