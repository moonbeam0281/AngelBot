export default function CommandCard({ command }) {
    const {
        name,
        description,
        category,
        scope,
        aliases = [],
        usageExamples = [],
        visibleInHelp
    } = command;

    const normalizedScope = String(scope ?? "").toLowerCase();

    const scopeColor =
        normalizedScope.includes("global")
            ? "text-[#8fffd0] border-[rgba(143,255,208,0.55)]"
            : normalizedScope.includes("guild")
                ? "text-[#8fd5ff] border-[rgba(143,213,255,0.55)]"
                : "text-[var(--accent-soft)] border-[rgba(135,206,255,0.4)]";

    //FIX THIS AS WELL <3 TY

    return (
        <div
            className="group relative rounded-2xl p-px transition"
            style={{
                background:
                    "linear-gradient(135deg, rgba(143,213,255,0.82), rgba(143,213,255,0.05), rgba(143,213,255,0.12))",
            }}
        >
            {/* Inner panel */}
            <div
                className="
          relative z-10
          rounded-2xl
          border border-[rgba(255,255,255,0.05)]
          p-4
          shadow-[0_18px_45px_rgba(15,23,42,0.9)]
          backdrop-blur-md
          transition-all
          overflow-hidden
          group-hover:-translate-y-0.5
        "
                style={{ backgroundColor: "var(--bg-panel)" }}
            >
                {/* Shine sweep */}
                <div
                    className="
            pointer-events-none
            absolute inset-0
            opacity-0 group-hover:opacity-100
            -translate-x-[120%]
            group-hover:translate-x-[120%]
            bg-gradient-to-r
            from-transparent via-white/10 to-transparent
            transition-all duration-900
          "
                />

                {/* Header */}
                <div className="flex justify-between gap-4">
                    <div>
                        <h2 className="m-0 text-[1.25rem] font-semibold tracking-wide text-[var(--text-main)]">
                            {name}
                        </h2>
                        <p className="mt-1 mb-0 text-[0.9rem] opacity-80 text-[var(--text-main)]">
                            {description}
                        </p>
                    </div>

                    {scope && (
                        <span
                            className={`
                self-start rounded-full px-3 py-1
                text-[0.75rem] font-semibold uppercase
                bg-[var(--bg-soft)]
                border ${scopeColor}
                backdrop-blur
              `}
                        >
                            {scope}
                        </span>
                    )}
                </div>

                {/* Aliases */}
                {aliases.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 text-[0.85rem] text-[var(--text-main)]">
                        <span className="min-w-[70px] font-semibold opacity-85">
                            Aliases:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {aliases.map((a, idx) => (
                                <span
                                    key={idx}
                                    className="
                    rounded-full px-2 py-0.5
                    text-[0.8rem]
                    bg-[var(--bg-panel)]
                    border border-[rgba(135,206,255,0.3)]
                    backdrop-blur-sm
                  "
                                >
                                    {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Usage */}
                {usageExamples.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 text-[0.85rem] text-[var(--text-main)]">
                        <span className="min-w-[70px] font-semibold opacity-85">
                            Usage:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {usageExamples.map((ue, index) => (
                                <span
                                    key={index}
                                    className="
                    inline-block rounded-md
                    bg-[var(--bg-panel)]
                    border border-[rgba(135,206,255,0.35)]
                    px-3 py-1
                    text-[0.8rem]
                    backdrop-blur-sm
                  "
                                >
                                    {ue}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-[0.8rem] opacity-90">
                    <span className={`category-${category}`}>
                        {category}
                    </span>

                    {!visibleInHelp && (
                        <span
                            className="
                rounded-full px-2 py-0.5
                bg-[rgba(80,20,36,0.9)]
                border border-[rgba(255,155,155,0.7)]
                text-[#ffb0b0]
                text-[0.75rem] font-semibold uppercase
              "
                        >
                            Hidden
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
