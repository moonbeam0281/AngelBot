-- 003_users.sql
-- Basic tables for tracking guilds and users (future-friendly)

CREATE TABLE IF NOT EXISTS guilds (
    guild_id   BIGINT PRIMARY KEY,
    name       TEXT,
    icon_url   TEXT,
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    user_id    BIGINT PRIMARY KEY,
    username   TEXT,
    discriminator TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_users (
    guild_id   BIGINT NOT NULL REFERENCES guilds(guild_id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(user_id)  ON DELETE CASCADE,
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen  TIMESTAMPTZ,
    PRIMARY KEY (guild_id, user_id)
);
