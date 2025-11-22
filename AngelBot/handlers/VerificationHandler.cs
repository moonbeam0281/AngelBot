using System.Collections.Concurrent;
using System.Security.Cryptography;
using AngelBot.Classes;
using AngelBot.Database.Repositories;

namespace AngelBot.Handlers
{
    public class VerificationHandler
    {
        private readonly ConcurrentDictionary<ulong, VerificationConfig> _guildConfigs = new();
        private readonly ConcurrentDictionary<string, VerificationSession> _sessions = new();

        public static VerificationHandler Instance { get; } = new VerificationHandler();

        private VerificationHandler() { }

        private static string GenerateToken(int byteLength = 16)
        {
            byte[] bytes = new byte[byteLength];
            RandomNumberGenerator.Fill(bytes);
            return Convert.ToHexString(bytes).ToLower();
        }

        // ---------- GUILD CONFIG ----------

        public async Task SetGuildConfigAsync(ulong guildId, ulong? channelId, ulong? roleId, bool enabled)
        {
            var cfg = new VerificationConfig
            {
                GuildId = guildId,
                VerificationChannelId = channelId,
                VerificationRoleId = roleId,
                Enabled = enabled
            };

            _guildConfigs[guildId] = cfg;
            await VerificationRepo.Instance.SaveGuildConfigAsync(cfg);
        }

        public async Task<VerificationConfig?> GetGuildConfigAsync(ulong guildId)
        {
            if (_guildConfigs.TryGetValue(guildId, out var cached))
                return cached;

            var dbCfg = await VerificationRepo.Instance.GetGuildConfigAsync(guildId);
            if (dbCfg != null)
                _guildConfigs[guildId] = dbCfg;

            return dbCfg;
        }

        // ---------- SESSIONS ----------

        public async Task<VerificationSession> CreateSessionAsync(ulong guildId, ulong userId, ulong? channelId = null)
        {
            var config = await GetGuildConfigAsync(guildId);

            var token = GenerateToken(32);
            var session = new VerificationSession
            {
                Token = token,
                GuildId = guildId,
                UserId = userId,
                ChannelId = channelId,
                RoleId = config?.VerificationRoleId,
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(15)
            };

            _sessions[token] = session;
            return session;
        }

        public VerificationSession? GetSession(string token)
        {
            if (!_sessions.TryGetValue(token, out var session))
                return null;

            if (session.IsExpired)
            {
                _sessions.TryRemove(token, out _);
                return null;
            }

            return session;
        }

        public VerificationSession? CompleteSession(string token)
        {
            if (!_sessions.TryRemove(token, out var session))
                return null;

            if (session.IsExpired)
                return null;

            return session;
        }

        public void CleanupExpired()
        {
            var now = DateTimeOffset.UtcNow;
            foreach (var kv in _sessions)
            {
                if (kv.Value.ExpiresAt <= now)
                {
                    _sessions.TryRemove(kv.Key, out _);
                }
            }
        }
    }
}
