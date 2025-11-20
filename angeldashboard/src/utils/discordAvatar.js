
export function getDiscordAvatarUrl(user, size = 64) {
    if (!user) return null;

    if (user.avatar) {
        const isGif = user.avatar.startsWith("a_");
        const ext = isGif ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
    }
    const index =
        user.discriminator && user.discriminator !== "0"
            ? Number(user.discriminator) % 5
            : 0;

    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}
