import { useAuth } from "../context/AuthContext";
import { getDiscordAvatarUrl } from "../utils/discordAvatar";
import { useBotInfo } from "../context/BotInfoContext";
import "./NavBar.css";

export default function NavBar() {
    const { user, logout } = useAuth();
    const { botInfo } = useBotInfo();
    const avatarUrl = user ? getDiscordAvatarUrl(user, 64) : null;

    return (
        <div className="navbar-root">
            <div className="navbar-left">
                <div className="navbar-stats">
                    <span className="navbar-stat">
                        🛡️ {botInfo?.serverCount} servers
                    </span>
                    <span className="navbar-stat">
                        👥 {botInfo?.userCount} users
                    </span>
                </div>
            </div>


            <div className="navbar-right">
                {user && (
                    <div className="navbar-user">
                        {avatarUrl ? (
                            <img
                                className="navbar-avatar-image"
                                src={avatarUrl}
                                alt={user.username}
                            />
                        ) : (
                            <span className="navbar-avatar-fallback">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <span className="navbar-name">{user.username}</span>
                    </div>
                )}
                <button className="navbar-logout" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
