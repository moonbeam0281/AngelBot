import { useStyles } from "../../../context/StyleContext";

export default function CommandCard({ command }) {
    const { styles, getGradientText } = useStyles();

    const {
        name,
        description,
        category,
        scope,
        aliases = [],
        usageExamples = [],
        visibleInHelp,
    } = command;

    const normalizedScope = String(scope ?? "").toLowerCase();

    // map scope -> style variant
    let scopeVariantClass = styles.commands.scopeDefault;
    if (normalizedScope.includes("global")) {
        scopeVariantClass = styles.commands.scopeGlobal;
    } else if (normalizedScope.includes("guild")) {
        scopeVariantClass = styles.commands.scopeGuild;
    }

    return (
        <div className={styles.commands.cardOuter}>
            {/* Inner panel */}
            <div className={styles.commands.cardInner}>
                {/* Shine sweep */}
                <div className={styles.commands.shine} />

                {/* Header */}
                <div className="flex justify-between gap-4">
                    <div>
                        <h2
                            className={`${styles.commands.headerTitle} ${getGradientText(
                                "title"
                            )}`}
                        >
                            {`${name[0].toUpperCase()}${name.slice(1)}`}
                        </h2>
                        <p
                            className={`${styles.commands.headerDescription} ${styles.text.soft}`}
                        >
                            {description}
                        </p>
                    </div>

                    {scope && (
                        <span
                            className={`
                                ${styles.commands.scopeBase}
                                ${scopeVariantClass}
                            `}
                        >
                            Slash Scope : {scope}
                        </span>
                    )}
                </div>

                {/* Aliases */}
                {aliases.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 text-[0.85rem]">
                        <span className={styles.commands.aliasesLabel}>
                            Aliases:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {aliases.map((a, idx) => (
                                <span
                                    key={idx}
                                    className={styles.commands.aliasPill}
                                >
                                    {a}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Usage */}
                {usageExamples.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 text-[0.85rem]">
                        <span className={styles.commands.aliasesLabel}>
                            Usage:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {usageExamples.map((ue, index) => (
                                <span
                                    key={index}
                                    className={styles.commands.usagePill}
                                >
                                    {ue}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className={styles.commands.footerRow}>
                    <span className={`cmd-pill category-${category}`}>
                        {category}
                    </span>

                    {!visibleInHelp && (
                        <span className={styles.commands.hiddenBadge}>
                            Hidden
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
