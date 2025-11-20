import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";
import { callApiGet } from "../handlers/apiClientHandler";
import { useState, useEffect } from "react";

export default function SideBar() {
    const location = useLocation();
    const [bot, setBot] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        callApiGet("/info/bot")
            .then(res => {
                if (res.success && res.data?.ok) {
                    setBot(res.data.bot);
                }
            })
            .catch(() => { });
    }, []);

    const bannerStyle = bot?.banner
        ? { backgroundImage: `url(${bot.banner})` }
        : {};

    const items = [
        { label: "Home", path: "/dashboard", icon: "🏠" },
        { label: "Guilds", path: "/dashboard/guilds", icon: "🛡️" },
        { label: "Commands", path: "/dashboard/commands", icon: "⚙️" },
        { label: "Settings", path: "/dashboard/settings", icon: "🔧" }
    ];

    return (
        <div className={"sidebar-root" + (collapsed ? " collapsed" : "")}>
            <div className="sidebar-bot-card" style={bannerStyle}>
                {bot && (
                    <>
                        <img
                            className="sidebar-bot-avatar"
                            src={bot.avatar}
                            alt={bot.name}
                        />
                        <div className="sidebar-bot-name">{bot.name}</div>
                        {collapsed && <hr />}
                    </>
                )}
            </div>

            <div className="sidebar-items">
                {items.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={
                            "sidebar-item" +
                            (location.pathname === item.path ? " active" : "")
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="sidebar-footer">
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setCollapsed(prev => !prev)}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? "⮞" : "⮜"}
                </button>
            </div>
        </div>
    );
}
