import { useState } from "react";
import { useBotInfo } from "../../context/BotInfoContext";
import CommandCard from "./dashboardComponents/CommandCard";

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

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-sm opacity-80">Loading bot info…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-red-300 bg-[rgba(80,20,36,0.6)] border border-[rgba(255,155,155,0.6)] rounded-md px-3 py-2">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 text-(--text-main)">
            {/* Header */}
            <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-[2rem] font-bold angel-gradient-text">
                    Commands
                </h1>

                <span className="text-sm opacity-70">
                    {filtered.length} / {commands.length}
                </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search commands…"
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
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {/* Category dropdown */}
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
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Command list */}
            <div className="mt-4 flex flex-col gap-4">
                {filtered.map((cmd, idx) => (
                    <CommandCard key={cmd.name ?? `command-${idx}`} command={cmd} />
                ))}

                {filtered.length === 0 && (
                    <div className="mt-6 text-center text-sm opacity-70">
                        No commands match your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
