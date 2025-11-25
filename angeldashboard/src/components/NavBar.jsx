import { useAuth } from "../context/AuthContext";
import { getDiscordAvatarUrl } from "../utils/discordAvatar";
import { useTheme } from "../context/ThemeContext";

export default function NavBar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const avatarUrl = user ? getDiscordAvatarUrl(user, 64) : null;

    // A single beautiful Angel quote
    const quote = "“A small spark can guide the lost.” — Angel";

    return (
        <header
            className="
                flex items-center justify-between
                px-6 py-3 md:px-8 md:py-4
                border-b border-[rgba(135,206,255,0.25)]
                bg-bg-panel/95
                text-text-main
                backdrop-blur-sm
                shadow-angel-soft
                z-10
            "
        >
            {/* LEFT: Static Angel quote */}
            <div className="flex items-center flex-1 min-w-0">
                <span
                    className="
                        angel-gradient-text
                        text-[0.9rem] md:text-[1.05rem]
                        whitespace-nowrap
                        select-none
                        drop-shadow-[0_0_6px_rgba(143,213,255,0.35)]
                        opacity-95
                    "
                >
                    {quote}
                </span>
            </div>

            {/* RIGHT: Theme toggle, avatar, logout */}
            <div className="flex items-center gap-3 shrink-0">

                {/* Theme toggle */}
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="
                        hidden sm:flex
                        h-9 w-9 items-center justify-center
                        rounded-full
                        border border-[rgba(135,206,255,0.6)]
                        bg-bg-soft
                        text-accent-soft
                        shadow-angel-soft
                        transition
                        hover:bg-bg-panel
                        hover:shadow-angel-strong
                        cursor-pointer
                    "
                    title={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </button>

                {/* Avatar + username */}
                {user && (
                    <div className="flex items-center gap-2">
                        {avatarUrl ? (
                            <img
                                className="
                                    h-9 w-9 md:h-10 md:w-10
                                    rounded-full object-cover
                                    border border-[rgba(191,229,255,0.55)]
                                    shadow-angel-soft
                                "
                                src={avatarUrl}
                                alt={user.username}
                            />
                        ) : (
                            <span
                                className="
                                    flex h-9 w-9 items-center justify-center
                                    rounded-full bg-bg-soft
                                    border border-[rgba(191,229,255,0.55)]
                                    text-sm font-semibold
                                "
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        )}

                        <span className="text-sm md:text-base font-medium">
                            {user.username}
                        </span>
                    </div>
                )}

                {/* Logout */}
                <button
                    type="button"
                    onClick={logout}
                    className="
                        text-xs md:text-sm
                        px-3 py-1.5 md:px-4 md:py-2
                        rounded-lg
                        font-semibold
                        border border-[rgba(135,206,255,0.55)]
                        bg-bg-soft
                        text-accent-soft
                        shadow-angel-soft
                        transition
                        hover:bg-bg-panel
                        hover:border-[rgba(191,229,255,0.9)]
                        hover:shadow-angel-strong
                        cursor-pointer
                    "
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
