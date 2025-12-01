import { useState } from "react";
import { useBotInfo } from "../../context/BotInfoContext";
import CommandCard from "./components/CommandCard.jsx";
import { useStyles } from "../../context/StyleContext.jsx";

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
    const { styles, getGradientText } = useStyles();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const commands = botInfo?.commands ?? [];
    const categories = ["All", ...CATEGORY_ENUM];

    const term = search.trim().toLowerCase();
    const filtered = commands.filter((cmd) => {
        if (category !== "All" && cmd.category !== category) return false;
        if (!term) return true;

        return (
            cmd.name?.toLowerCase().includes(term) ||
            (cmd.description ?? "").toLowerCase().includes(term) ||
            (cmd.aliases ?? []).some((a) => a.toLowerCase().includes(term))
        );
    });

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className={`${styles.text.base} text-sm opacity-80`}>
                    Loading bot info…
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-[#fecaca] bg-[rgba(80,20,36,0.6)] border border-[rgba(248,113,113,0.6)] rounded-md px-3 py-2">
                Error: {error}
            </div>
        );
    }

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
                    Commands
                </h1>

                <span className={`${styles.text.base} text-sm opacity-70`}>
                    Commands displayed : {filtered.length} / {commands.length}
                </span>
            </header>

            {/* Controls (search + category) */}
            <div className={styles.search.container}>
                {/* Search input (2/3) */}
                <div className={styles.search.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Search commands…"
                        className={styles.search.input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Category dropdown (1/3) */}
                <div className={styles.search.selectWrapper}>
                    <select
                        className={styles.search.select}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <hr className="border-0 h-px bg-transparent shadow-[0_7px_9px_rgba(0,0,0,0.35)]" />

            {/* Command list */}
            <div className="flex flex-col gap-2">
                {filtered.map((cmd, idx) => (
                    <CommandCard
                        key={cmd.name ?? `command-${idx}`}
                        command={cmd}
                    />
                ))}
            </div>
            {filtered.length === 0 && (
                <div className="mt-4 text-center text-sm opacity-70">
                    No commands match your filters.
                </div>
            )}
        </div>
    );
}
