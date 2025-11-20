import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
    const location = useLocation();

    const items = [
        { label: "Home", path: "/dashboard", icon: "🏠" },
        { label: "Guilds", path: "/dashboard/guilds", icon: "🛡️" },
        { label: "Commands", path: "/dashboard/commands", icon: "⚙️" },
        { label: "Settings", path: "/dashboard/settings", icon: "🔧" }
    ];

    return (
        <div className="sidebar-root">
            <div className="sidebar-title">AngelBot</div>

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
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
