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
            badge: "bg-(--angel-guild-perm-pill) text-[#ffd700]",
            bg:"o"
        },
        AdminPermissions: {
            badge: "bg-(--angel-guild-perm-pill) text-[#4da6ff]",
            bg:"a"
        },
        CommonUser: {
            badge: "bg-(--angel-guild-perm-pill) text-[#4dff88]",
            bg:"c"
        }
    };

    const cfg = permConfig[permission] ?? permConfig.CommonUser;
    const firstLetter = guildName?.charAt(0)?.toUpperCase() ?? "?";

    const hasBanner = Boolean(guildBanner);

    return (
        <div className="group relative h-[190px] w-[260px] rounded-[18px] overflow-hidden border-3 border-(--btn-border-soft) transition-transform duration-200 hover:-translate-y-2">
            {/* Ambient glow border */}
            <div
                className="relative h-full w-full rounded-2xl overflow-hidden backdrop-blur-xs"
                style={
                    hasBanner
                        ? {
                            backgroundColor: "var(--bg-panel)",
                        }
                        : {
                            backgroundImage: `var(--angel-gradient-guild-${cfg.bg})`,
                            backgroundSize: "200% 200%",
                            animation: "angel-gradient 12s ease-in-out infinite",
                        }
                }
            >
                {/* Blurred banner */}
                {guildBanner && (<img src={guildBanner} className="absolute inset-0 h-full w-full object-cover opacity-20 blur-[6px] scale-105"/>)}

                {/* Hover shine sweep */}
                <div className="pointer-events-none absolute inset-0 opacity-0 -translate-x-full bg-linear-to-r from-transparent via-white/14 to-transparent group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700"/>

                {/* Avatar */}
                <div className="relative z-20 flex justify-center pt-4">
                    {guildAvatar ? (
                        <img
                            className=" h-17 w-17 rounded-full border-3 border-(--btn-border-soft) object-cover shadow-(--angel-shadow-strong)"
                            src={guildAvatar}
                            alt={guildName}
                        />
                    ) : (
                        <div
                            className="h-16 w-16 flex items-center justify-center rounded-full border-[3px] border-[#ffffffcc] bg-(--bg-panel) text-xl font-semibold text-(--accent-soft) shadow-[0_18px_45px_rgba(15,23,42,0.9)]"
                            aria-hidden="true"
                        >
                            {firstLetter}
                        </div>
                    )}
                </div>

                {/* Text content */}
                <div className="relative z-20 mt-3 px-3 pb-3 text-center text-(--text-main)">
                    <h2 className="m-0 text-[1.05rem] font-semibold truncate">
                        {guildName}
                    </h2>
                    <p className="m-0 text-[0.7rem] opacity-80 font-semibold">
                        ID: {guildId}
                    </p>

                    <span className={`inline-block mt-3 rounded-md px-2 py-1 text-[0.8rem] font-bold ${cfg.badge}`}>
                        {permission}
                    </span>
                </div>
            </div>
        </div>
    );
}
