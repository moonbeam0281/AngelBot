using System.Collections.Concurrent;
using System.Security.Cryptography;
using AngelBot.Classes;

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

        public void SetGuildConfig(ulong guildId, ulong? channelId, ulong? roleId, bool enabled = true)
        {
            _guildConfigs[guildId] = new VerificationConfig
            {
                GuildId = guildId,
                VerificationChannelId = channelId,
                VerificationRoleId = roleId,
                Enabled = enabled
            };
        }

        public VerificationConfig? GetGuildConfig(ulong guildId)
        {
            _guildConfigs.TryGetValue(guildId, out var cfg);
            return cfg;
        }

        public VerificationSession CreateSession(ulong guildId, ulong userId, ulong? channelId = null)
        {
            var config = GetGuildConfig(guildId);

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
