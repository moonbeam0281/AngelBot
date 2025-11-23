import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";
import { useState } from "react";
import { useBotInfo } from "../context/BotInfoContext";

export default function SideBar() {
    const { botInfo } = useBotInfo();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);

    const bannerStyle = botInfo?.banner
        ? { backgroundImage: `url(${botInfo.banner})` }
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
                {botInfo && (
                    <>
                        <img
                            className="sidebar-bot-avatar"
                            src={botInfo.avatar}
                            alt={botInfo.name}
                        />
                        <div className="sidebar-bot-name">{botInfo.name}</div>
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
