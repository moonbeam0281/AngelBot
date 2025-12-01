import { useAuth } from "../../context/AuthContext";
import { getDiscordAvatarUrl } from "../../utils/discordAvatar";
import { useTheme } from "../../context/ThemeContext";
import { useStyles } from "../../context/StyleContext.jsx";

export default function NavBar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { styles, getButton, getGradientText } = useStyles();

    const avatarUrl = user ? getDiscordAvatarUrl(user, 64) : null;
    const quote = "“A small spark can guide the lost.” — Angel";

    return (
        <header className={styles.navbar.container}>
            {/* LEFT: Angel quote */}
            <div className="flex items-center flex-1 min-w-0">
                <span
                    className={getGradientText(
                        "soft",
                        "text-[0.9rem] md:text-[1.05rem] whitespace-nowrap select-none drop-shadow-[0_0_6px_rgba(143,213,255,0.35)] opacity-95"
                    )}
                >
                    {quote}
                </span>
            </div>

            {/* RIGHT: theme toggle, user, logout */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Theme toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className={getButton(
                        "ghost",
                        "sm",
                        "hidden sm:inline-flex h-9 w-9 rounded-full p-0"
                    )}
                    title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </button>

                {/* Avatar + username */}
                {user && (
                    <div className="flex items-center gap-2">
                        {avatarUrl ? (
                            <img
                                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border border-(--btn-border-soft) shadow-(--btn-shadow)"
                                src={avatarUrl}
                                alt={user.username}
                            />
                        ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--bg-soft) border border-(--btn-border-soft) text-sm font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        )}

                        <span className="text-sm md:text-base font-medium text-(--text-main)">
                            {user.username}
                        </span>
                    </div>
                )}

                {/* Logout */}
                <button
                    type="button"
                    onClick={logout}
                    className={getButton("ghost", "sm")}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
