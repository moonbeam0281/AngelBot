CREATE TABLE IF NOT EXISTS dev_users (
    user_id   BIGINT PRIMARY KEY,
    added_by  BIGINT,
    added_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
