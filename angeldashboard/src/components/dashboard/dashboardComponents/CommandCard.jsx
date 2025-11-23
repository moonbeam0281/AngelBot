
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

    return (
        <div className="command-card">
            <div className="command-card-header">
                <div>
                    <h2 className="command-card-title">{name}</h2>
                    <p className="command-card-desc">{description}</p>
                </div>

                <span className={`command-scope scope-${scope?.toLowerCase()}`}>
                    {scope}
                </span>
            </div>

            {aliases.length > 0 && (
                <div className="command-row">
                    <span className="command-label">Aliases:</span>
                    <div className="command-chips">
                        {aliases.map((a, idx) => (
                            <span key={`${name}-alias-${idx}`} className="command-chip">
                                {a}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {usageExamples.length > 0 && (
                <div className="command-row">
                    <span className="command-label">Usage:</span>
                    <div className="command-usage-list">
                        {usageExamples.map((ue, index) => (
                            <span key={index} className="usage-box">{ue}</span>
                        ))}
                    </div>
                </div>

            )}

            <div className="command-footer">
                <span className={`command-category category-${category}`}>
                    {category}
                </span>

                {!visibleInHelp && (
                    <span className="command-hidden">Hidden</span>
                )}
            </div>

        </div>
    );
}
