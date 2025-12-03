import { useAuth } from "../../context/AuthContext";
import GuildCard from "./components/GuildCard.jsx";
import { useState, useMemo } from "react";
import { useStyles } from "../../context/StyleContext.jsx";

export default function Guilds() {
    const { user } = useAuth();
    const { styles, getGradientText } = useStyles();
    const guilds = user?.commonGuilds ?? [];

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const term = search.trim().toLowerCase();

    const filtered = guilds.filter((g) => {
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

    return (
        <div className="flex flex-col gap-6 select-none">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <h1
                    className={getGradientText(
                        "soft",
                        "text-[2rem] font-extrabold mb-1 text-center"
                    )}
                >
                    Guilds
                </h1>

                <span className={`${styles.text.soft} text-sm opacity-70`}>
                    Servers displayed : {filtered.length} / {guilds.length}
                </span>
            </header>

            {/* Search + filter */}
            <div className={styles.search.container}>
                <div className={styles.search.searchWrapper}>
                    <input
                        className={styles.search.input}
                        placeholder="Search guilds..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.search.selectWrapper}>
                    <select
                        className={styles.search.select}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Owner">Owner</option>
                        <option value="AdminPermissions">Admin</option>
                        <option value="CommonUser">User</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-wrap gap-3">
                {filtered.map((g) => (
                    <GuildCard key={g.guildId} guild={g} />
                ))}
            </div>
            {filtered.length === 0 && (
                    <div className="mt-4 text-center text-sm opacity-70">
                        No guilds match your filters.
                    </div>
                )}
        </div>
    );
}
