using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace AngelBot.Classes
{
    public static class JwtHelper
    {
        private static string Secret =>
            Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? "dev-secret-change-me-please";

        private static byte[] SecretBytes => Encoding.UTF8.GetBytes(Secret);

        private static string Base64UrlEncode(byte[] bytes)
        {
            return Convert.ToBase64String(bytes)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        private static byte[] Base64UrlDecode(string input)
        {
            string padded = input
                .Replace('-', '+')
                .Replace('_', '/');
            switch (padded.Length % 4)
            {
                case 2: padded += "=="; break;
                case 3: padded += "="; break;
            }
            return Convert.FromBase64String(padded);
        }

        public static string GenerateToken(DashboardUser user, TimeSpan lifetime)
        {
            var header = new { alg = "HS256", typ = "JWT" };
            var now = DateTimeOffset.UtcNow;
            var payload = new
            {
                sub = user.Id,
                username = user.Username,
                discriminator = user.Discriminator,
                avatar = user.Avatar,
                iat = now.ToUnixTimeSeconds(),
                exp = now.Add(lifetime).ToUnixTimeSeconds()
            };

            var headerJson = JsonSerializer.Serialize(header);
            var payloadJson = JsonSerializer.Serialize(payload);

            var headerBytes = Encoding.UTF8.GetBytes(headerJson);
            var payloadBytes = Encoding.UTF8.GetBytes(payloadJson);

            var headerB64 = Base64UrlEncode(headerBytes);
            var payloadB64 = Base64UrlEncode(payloadBytes);

            var toSign = $"{headerB64}.{payloadB64}";
            var sigBytes = HmacSha256(Encoding.UTF8.GetBytes(toSign), SecretBytes);
            var sigB64 = Base64UrlEncode(sigBytes);

            return $"{toSign}.{sigB64}";
        }

        private static byte[] HmacSha256(byte[] data, byte[] key)
        {
            using var hmac = new HMACSHA256(key);
            return hmac.ComputeHash(data);
        }

        public static bool TryValidateToken(string token, out DashboardUser? user)
        {
            user = null;
            if (string.IsNullOrWhiteSpace(token)) return false;

            var parts = token.Split('.');
            if (parts.Length != 3) return false;

            var headerB64 = parts[0];
            var payloadB64 = parts[1];
            var sigB64 = parts[2];

            var toSign = $"{headerB64}.{payloadB64}";
            var expectedSigBytes = HmacSha256(Encoding.UTF8.GetBytes(toSign), SecretBytes);
            var expectedSigB64 = Base64UrlEncode(expectedSigBytes);

            if (!CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(expectedSigB64),
                    Encoding.UTF8.GetBytes(sigB64)))
            {
                return false;
            }

            var payloadBytes = Base64UrlDecode(payloadB64);
            using var doc = JsonDocument.Parse(payloadBytes);
            var root = doc.RootElement;

            if (!root.TryGetProperty("exp", out var expProp)) return false;
            var exp = expProp.GetInt64();
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (now >= exp) return false;

            var id = root.GetProperty("sub").GetString();
            var username = root.GetProperty("username").GetString();
            var discriminator = root.GetProperty("discriminator").GetString();
            string? avatar = null;
            if (root.TryGetProperty("avatar", out var av) && av.ValueKind == JsonValueKind.String)
            {
                avatar = av.GetString();
            }

            if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(username)) return false;

            user = new DashboardUser
            {
                Id = id,
                Username = username,
                Discriminator = discriminator ?? "0",
                Avatar = avatar
            };

            return true;
        }
    }
}
