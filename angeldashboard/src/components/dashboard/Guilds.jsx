import { useAuth } from "../../context/AuthContext";
import GuildCard from "./guildsComponents/GuildCard";
import { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Guilds() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const guilds = user?.commonGuilds ?? [];

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const term = search.trim().toLowerCase();

    const filtered = guilds.filter(g => {
        if (filter !== "All" && g.permission !== filter) return false;
        if (!term) return true;

        return (
            g.guildName.toLowerCase().includes(term) ||
            g.guildId.includes(term)
        );
    });

    const counts = useMemo(() => {
        const res = { Owner: 0, AdminPermissions: 0, CommonUser: 0 };
        for (const g of guilds) {
            if (res[g.permission] !== undefined) res[g.permission]++;
        }
        return res;
    }, [guilds]);

    const isLight = theme === "light";

    const headerGradient =
        isLight
            ? "bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-500"
            : "bg-gradient-to-r from-accent-soft via-pink-300 to-purple-300";

    const searchShellGradient =
        isLight
            ? "bg-gradient-to-r from-sky-200 via-teal-100 to-cyan-100"
            : "bg-gradient-to-r from-[rgba(143,213,255,0.45)] via-[rgba(255,154,213,0.35)] to-[rgba(191,229,255,0.45)]";

    return (
        <div className="flex flex-col gap-4 text-text-main">
            {/* Header */}
            <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-[2rem] font-bold angel-gradient-text">
                    Guilds
                </h1>

                <span className="text-sm opacity-70">
                    {filtered.length} / {guilds.length}
                </span>
            </div>

            {/* Quick counts */}
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className="
                    rounded-full px-3 py-1
                    bg-bg-soft/70
                    border border-[rgba(135,206,255,0.35)]
                ">
                    Owner: {counts.Owner}
                </span>
                <span className="
                    rounded-full px-3 py-1
                    bg-bg-soft/70
                    border border-[rgba(135,206,255,0.35)]
                ">
                    Admin: {counts.AdminPermissions}
                </span>
                <span className="
                    rounded-full px-3 py-1
                    bg-bg-soft/70
                    border border-[rgba(135,206,255,0.35)]
                ">
                    User: {counts.CommonUser}
                </span>
            </div>

            {/* Search + filter block with theme-based gradient frame */}
            <div
                className={"flex flex-wrap gap-3"}
            >
                
                    <input
                        className="
                        flex-1 min-w-[220px]
                        rounded-xl px-4 py-2.5 text-sm
                        bg-bg-panel/70 backdrop-blur-sm
                        border border-[rgba(135,206,255,0.35)]
                        placeholder:text-[rgba(219,233,255,0.6)]
                        shadow-angel-soft
                        focus:outline-none
                        focus:border-(--accent-soft)
                        focus:shadow-angel-strong
                        transition
                    "
                        placeholder="Search guilds..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select
                        className="
                        min-w-[150px] rounded-xl px-4 py-2.5 text-sm
                        bg-bg-panel/70 backdrop-blur-sm
                        border border-[rgba(135,206,255,0.35)]
                        shadow-angel-soft
                        focus:outline-none
                        focus:border-(--accent-soft)
                        focus:shadow-angel-strong
                        transition
                    "
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Owner">Owner</option>
                        <option value="AdminPermissions">Admin</option>
                        <option value="CommonUser">User</option>
                    </select>
                </div>
            

            {/* List */}
            <div
                className="
                    mt-4
                    flex flex-wrap gap-5
                "
            >
                {filtered.map(g => (
                    <GuildCard key={g.guildId} guild={g} />
                ))}

                {filtered.length === 0 && (
                    <div className="mt-4 text-sm opacity-70">
                        No guilds match your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
