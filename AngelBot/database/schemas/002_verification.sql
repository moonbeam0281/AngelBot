-- 002_verification.sql
-- Stores per-guild verification configuration

CREATE TABLE IF NOT EXISTS verification_guild_settings (
    guild_id                BIGINT PRIMARY KEY,
    verification_channel_id BIGINT,
    verification_role_id    BIGINT,
    enabled                 BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
