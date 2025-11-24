

export default function GuildCard({ guild }) {
    const {
        guildName,
        guildId,
        guildAvatar,
        guildBanner,
        permission
    } = guild;

    const borderColor =
        permission === "Owner" ? "#FFD700" :
        permission === "AdminPermissions" ? "#4da6ff" :
        "#4dff88";

    return (
        <div
            className="guild-card"
            style={{
                borderColor,
                backgroundImage: guildBanner
                    ? `url(${guildBanner})`
                    : "linear-gradient(135deg, #1c2333, #121826)"
            }}
        >
            <div className="guild-card-overlay" />

            <div className="guild-card-avatar-wrapper">
                <img
                    className="guild-card-avatar"
                    src={guildAvatar}
                    alt={guildName}
                />
            </div>

            <div className="guild-card-info">
                <h2 className="guild-card-name">{guildName}</h2>
                <p className="guild-card-id">ID: {guildId}</p>
                <span className={`guild-card-perm perm-${permission}`}>
                    {permission}
                </span>
            </div>
        </div>
    );
}
