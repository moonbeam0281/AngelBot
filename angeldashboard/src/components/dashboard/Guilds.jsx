import { useAuth } from "../../context/AuthContext";
import GuildCard from "./guildsComponents/GuildCard";
import { useState } from "react";

export default function Guilds() {
    const { user } = useAuth();
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

    return (
        <div className="guilds-container">

            <div className="guilds-header">
                <h1>Guilds</h1>
                <span className="guilds-count">
                    {filtered.length} / {guilds.length}
                </span>
            </div>

            <div className="guilds-controls">
                <input
                    className="guilds-search"
                    placeholder="Search guilds..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="guilds-select"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Owner">Owner</option>
                    <option value="AdminPermissions">Admin</option>
                    <option value="CommonUser">User</option>
                </select>
            </div>

            <div className="guilds-list">
                {filtered.map(g => (
                    <GuildCard key={g.guildId} guild={g} />
                ))}

                {filtered.length === 0 && (
                    <div className="guilds-empty">
                        No guilds match your filters.
                    </div>
                )}
            </div>

        </div>
    );
}
