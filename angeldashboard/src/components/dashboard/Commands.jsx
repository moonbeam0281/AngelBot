import { useState } from "react";
import { useBotInfo } from "../../context/BotInfoContext";
import CommandCard from "./dashboardComponents/commandCard";

const CATEGORY_ENUM = [
    "General",
    "Utility",
    "Fun",
    "Moderation",
    "Management",
    "Music",
    "Security",
    "Information",
    "Developer",
    "Owenr"
];

export default function Commands() {
    const { botInfo, loading, error } = useBotInfo();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const commands = botInfo?.commands ?? [];

    const categories = ["All", ...CATEGORY_ENUM];

    const term = search.trim().toLowerCase();
    const filtered = commands.filter(cmd => {
        if (category !== "All" && cmd.category !== category) return false;

        if (!term) return true;

        return (
            cmd.name?.toLowerCase().includes(term) ||
            (cmd.description ?? "").toLowerCase().includes(term) ||
            (cmd.aliases ?? []).some(a => a.toLowerCase().includes(term))
        );
    });

    if (loading) return <div className="dashhome-loading">Loading bot info…</div>;
    if (error) return <div className="dashhome-error">Error: {error}</div>;

    return (
        <div className="commands-container">
            <div className="commands-header">
                <h1 className="commands-title">Commands</h1>
                <span className="commands-count">
                    {filtered.length} / {commands.length}
                </span>
            </div>

            <div className="commands-controls">
                <input
                    type="text"
                    placeholder="Search commands…"
                    className="commands-search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select
                    className="commands-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="commands-list">
                {filtered.map((cmd, idx) => (
                    <CommandCard key={cmd.name ?? `command-${idx}`} command={cmd} />
                ))}

                {filtered.length === 0 && (
                    <div className="commands-empty">
                        No commands match your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
