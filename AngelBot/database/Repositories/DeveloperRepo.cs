using AngelBot.Classes;
using Npgsql;

namespace AngelBot.Database.Repositories
{
    public class DeveloperRepo
    {
        private static readonly Lazy<DeveloperRepo> _instance =
            new(() => new DeveloperRepo());

        public static DeveloperRepo Instance => _instance.Value;

        private DeveloperRepo() { }

        public async Task<bool> IsDeveloperAsync(ulong userId)
        {
            await using var conn = DatabaseHandler.Instance.GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT 1
                FROM dev_users
                WHERE user_id = @u
                LIMIT 1;
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("u", (long)userId);

            var result = await cmd.ExecuteScalarAsync();
            return result != null;
        }

        public async Task SetDeveloperAsync(ulong userId, bool isDev, ulong? addedBy = null)
        {
            await using var conn = DatabaseHandler.Instance.GetConnection();
            await conn.OpenAsync();

            if (isDev)
            {
                const string sql = @"
                    INSERT INTO dev_users (user_id, added_by, added_at)
                    VALUES (@u, @by, NOW())
                    ON CONFLICT (user_id) DO UPDATE
                        SET added_by = EXCLUDED.added_by,
                            added_at = EXCLUDED.added_at;
                ";

                await using var cmd = new NpgsqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("u", (long)userId);
                cmd.Parameters.AddWithValue("by", (object?)addedBy is null ? DBNull.Value : (long)addedBy.Value);
                await cmd.ExecuteNonQueryAsync();
            }
            else
            {
                const string sql = @"DELETE FROM dev_users WHERE user_id = @u;";

                await using var cmd = new NpgsqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("u", (long)userId);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<IReadOnlyList<DevUser>> GetAllDevelopersAsync()
        {
            var result = new List<DevUser>();

            await using var conn = DatabaseHandler.Instance.GetConnection();
            await conn.OpenAsync();

            const string sql = @"
                SELECT user_id, added_by, added_at
                FROM dev_users
                ORDER BY added_at ASC;
            ";

            await using var cmd = new NpgsqlCommand(sql, conn);
            await using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var dev = new DevUser
                {
                    UserId = (ulong)reader.GetInt64(0),
                    AddedBy = reader.IsDBNull(1) ? null : (ulong?)reader.GetInt64(1),
                    AddedAt = reader.GetDateTime(2)
                };

                result.Add(dev);
            }

            return result;
        }
        public class DevUser
        {
            public ulong UserId { get; set; }
            public ulong? AddedBy { get; set; }
            public DateTimeOffset AddedAt { get; set; }
        }

    }
}
