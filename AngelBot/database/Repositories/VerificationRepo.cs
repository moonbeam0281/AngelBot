using AngelBot.Classes;
using Npgsql;

namespace AngelBot.Database.Repositories
{
    public class VerificationRepo
    {
        private static readonly Lazy<VerificationRepo> _instance =
            new(() => new VerificationRepo());

        public static VerificationRepo Instance => _instance.Value;

        private VerificationRepo() { }

        public async Task<VerificationConfig?> GetGuildConfigAsync(ulong guildId)
        {
            await using var conn = DatabaseHandler.Instance.GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT verification_channel_id, verification_role_id, enabled
                FROM verification_guild_settings
                WHERE guild_id = @g;
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("g", (long)guildId);

            await using var reader = await cmd.ExecuteReaderAsync();
            if (!await reader.ReadAsync())
                return null;

            var cfg = new VerificationConfig
            {
                GuildId = guildId,
                VerificationChannelId = reader.IsDBNull(0) ? null : (ulong?)reader.GetInt64(0),
                VerificationRoleId = reader.IsDBNull(1) ? null : (ulong?)reader.GetInt64(1),
                Enabled = reader.GetBoolean(2)
            };

            return cfg;
        }

        public async Task SaveGuildConfigAsync(VerificationConfig cfg)
        {
            await using var conn = DatabaseHandler.Instance.GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                INSERT INTO verification_guild_settings
                    (guild_id, verification_channel_id, verification_role_id, enabled, updated_at)
                VALUES (@g, @c, @r, @e, NOW())
                ON CONFLICT (guild_id) DO UPDATE
                    SET verification_channel_id = EXCLUDED.verification_channel_id,
                        verification_role_id    = EXCLUDED.verification_role_id,
                        enabled                 = EXCLUDED.enabled,
                        updated_at              = NOW();
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("g", (long)cfg.GuildId);
            cmd.Parameters.AddWithValue("c",
                (object?)cfg.VerificationChannelId is null
                    ? DBNull.Value
                    : (long)cfg.VerificationChannelId.Value);
            cmd.Parameters.AddWithValue("r",
                (object?)cfg.VerificationRoleId is null
                    ? DBNull.Value
                    : (long)cfg.VerificationRoleId.Value);
            cmd.Parameters.AddWithValue("e", cfg.Enabled);

            await cmd.ExecuteNonQueryAsync();
        }
    }
}
