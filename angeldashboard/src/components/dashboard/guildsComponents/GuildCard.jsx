export default function GuildCard({ guild }) {
    const {
        guildName,
        guildId,
        guildAvatar,
        guildBanner,
        permission
    } = guild;

    // ----- Permission-based colors -----
    const permConfig = {
        Owner: {
            border: "#FFD700",
            from: "rgba(255,215,0,0.22)",
            via: "rgba(255,215,0,0.05)",
            to: "rgba(255,215,0,0.12)",
            badge: "bg-[#ffd70033] text-[#ffd700]",
        },
        AdminPermissions: {
            border: "#4da6ff",
            from: "rgba(77,166,255,0.22)",
            via: "rgba(77,166,255,0.05)",
            to: "rgba(77,166,255,0.12)",
            badge: "bg-[#4da6ff33] text-[#4da6ff]",
        },
        CommonUser: {
            border: "#4dff88",
            from: "rgba(77,255,136,0.22)",
            via: "rgba(77,255,136,0.05)",
            to: "rgba(77,255,136,0.12)",
            badge: "bg-[#4dff8833] text-[#4dff88]",
        }
    };

    const cfg = permConfig[permission] ?? permConfig.CommonUser;

    const firstLetter = guildName?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div
            className="
                group
                relative
                h-[190px] w-[260px]
                rounded-[18px]
                overflow-hidden
                transition-transform duration-200
                hover:-translate-y-1
            "
            style={{ borderColor: cfg.border }}
        >
            {/* Ambient glow border */}
            <div
                className="
                    pointer-events-none
                    absolute -inset-0.5
                    rounded-[18px]
                    opacity-60
                    blur-[2px]
                    animate-[angel-card-pulse_6s_ease-in-out_infinite]
                "
                style={{
                    backgroundImage: `linear-gradient(135deg, ${cfg.from}, ${cfg.via}, ${cfg.to})`,
                }}
            />

            {/* Inner card (semi-transparent, respects theme via bg-panel) */}
            <div
                className="
                    relative
                    h-full w-full
                    rounded-2xl
                    border border-[rgba(255,255,255,0.04)]
                    bg-bg-panel/70
                    backdrop-blur-xs
                    shadow-angel-soft
                    overflow-hidden
                "
                style={{ borderColor: cfg.border }}
            >
                {/* Optional blurred banner */}
                {guildBanner && (
                    <img
                        src={guildBanner}
                        alt=""
                        className="
                            absolute inset-0
                            h-full w-full
                            object-cover
                            opacity-20
                            blur-[6px]
                            scale-105
                        "
                    />
                )}

                {/* Darken lower part for readability */}
                <div
                    className="
                        absolute inset-0
                        bg-linear-to-b
                        from-[rgba(0,0,0,0.1)]
                        via-[rgba(0,0,0,0.2)]
                        to-[rgba(0,0,0,0.65)]
                    "
                />

                {/* Hover shine sweep */}
                <div
                    className="
                        pointer-events-none
                        absolute inset-0
                        opacity-0
                        -translate-x-full
                        bg-linear-to-r
                        from-transparent via-white/14 to-transparent
                        group-hover:opacity-100
                        group-hover:translate-x-full
                        transition-all duration-700
                    "
                />

                {/* Avatar */}
                <div
                    className="
                        relative z-20
                        flex justify-center
                        pt-4
                    "
                >
                    {guildAvatar ? (
                        <img
                            className="
                                h-16 w-16
                                rounded-full
                                border-[3px] border-[#ffffffcc]
                                bg-bg-panel
                                object-cover
                                shadow-angel-strong
                            "
                            src={guildAvatar}
                            alt={guildName}
                        />
                    ) : (
                        <div
                            className="
                                h-16 w-16
                                flex items-center justify-center
                                rounded-full
                                border-[3px] border-[#ffffffcc]
                                bg-bg-panel
                                text-xl font-semibold text-accent-soft
                                shadow-angel-strong
                            "
                            aria-hidden="true"
                        >
                            {firstLetter}
                        </div>
                    )}
                </div>

                {/* Text content */}
                <div
                    className="
                        relative z-20
                        mt-3
                        px-3 pb-3
                        text-center
                        text-white
                    "
                >
                    <h2 className="m-0 text-[1.05rem] font-semibold truncate">
                        {guildName}
                    </h2>
                    <p className="m-0 mt-1 text-[0.7rem] opacity-80">
                        ID: {guildId}
                    </p>

                    <span
                        className={`
                            inline-block mt-2
                            rounded-md px-3 py-1
                            text-[0.7rem] font-semibold
                            ${cfg.badge}
                        `}
                    >
                        {permission}
                    </span>
                </div>
            </div>
        </div>
    );
}
