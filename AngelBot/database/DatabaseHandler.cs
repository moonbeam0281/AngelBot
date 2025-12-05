using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace AngelBot.Database
{
    /// <summary>
    /// Central DB access + schema loader for AngelBot.
    /// Uses DB_CONNECTION_STRING env variable.
    /// </summary>
    public class DatabaseHandler
    {
        private static readonly Lazy<DatabaseHandler> _instance =
            new(() => new DatabaseHandler());

        public static DatabaseHandler Instance => _instance.Value;

        private readonly string _connectionString;

        private DatabaseHandler()
        {
            _connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
                ?? throw new InvalidOperationException(
                    "DB_CONNECTION_STRING env variable is not set. " +
                    "Example: Host=localhost;Port=5432;Database=angelbot;Username=angelbot;Password=supersecret;");
        }

        /// <summary>
        /// Create a new NpgsqlConnection. Call OpenAsync() on it before use.
        /// </summary>
        public NpgsqlConnection GetConnection() => new(_connectionString);

        /// <summary>
        /// Apply all .sql schema files under /database/schemas (if present).
        /// Runs in filename order: 001_..., 002_..., etc.
        /// Safe to call on every startup.
        /// </summary>
        public async Task ApplySchemasAsync()
        {
            var baseDir = AppContext.BaseDirectory;
            var schemaDir = Path.Combine(baseDir, "database", "schemas");

            if (!Directory.Exists(schemaDir))
            {
                Console.WriteLine($"[DB] No schema directory found at: {schemaDir}");
                return;
            }

            var files = Directory.GetFiles(schemaDir, "*.sql")
                                 .OrderBy(f => f)
                                 .ToArray();

            if (files.Length == 0)
            {
                Console.WriteLine("[DB] No .sql schema files found in /database/schemas.");
                return;
            }

            await using var conn = GetConnection();
            await conn.OpenAsync();

            Console.WriteLine($"[DB] Applying {files.Length} schema file(s)...");
            foreach (var file in files)
            {
                var sql = await File.ReadAllTextAsync(file);
                if (string.IsNullOrWhiteSpace(sql))
                    continue;

                Console.WriteLine($"[DB]  -> {Path.GetFileName(file)}");
                await using var cmd = new NpgsqlCommand(sql, conn);
                await cmd.ExecuteNonQueryAsync();
            }

            Console.WriteLine("[DB] Schema apply complete.");
        }

        /// <summary>
        /// Apply all .sql schema files under /database/schemas (if present).
        /// Runs in filename order: 001_..., 002_..., etc.
        /// Safer to call on every startup because it has mutliple attempts
        /// without crashing the bot.
        /// </summary>
        public async Task ApplySchemasWithRetryAsync(int maxAttempts = 10, int delayMs = 3000)
        {
            for (int attempt = 1; attempt <= maxAttempts; attempt++)
            {
                try
                {
                    Console.WriteLine($"[DB] Applying schemas (attempt {attempt}/{maxAttempts})...");
                    await ApplySchemasAsync();
                    Console.WriteLine("[DB] Schema apply succeeded.");
                    return;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[DB] Schema apply failed (attempt {attempt}): {ex.Message}");

                    if (attempt == maxAttempts)
                    {
                        Console.WriteLine("[DB] Giving up after max attempts.");
                        throw;
                    }

                    await Task.Delay(delayMs);
                }
            }
        }

        public async Task<bool> CheckConnectionAsync()
        {
            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();

                await using var cmd = new NpgsqlCommand("SELECT 1;", conn);
                await cmd.ExecuteScalarAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
