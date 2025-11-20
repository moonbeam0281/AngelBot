using System.Net;

namespace AngelBot.Classes
{
    public static class DashboardAuth
    {
        public const string CookieName = "angel_session";

        public static DashboardUser? GetUserFromContext(HttpListenerContext ctx)
        {
            var cookie = ctx.Request.Cookies[CookieName];
            if (cookie == null) return null;

            var token = cookie.Value;
            if (string.IsNullOrWhiteSpace(token)) return null;

            if (!JwtHelper.TryValidateToken(token, out var user))
                return null;

            return user;
        }

        public static void SetAuthCookie(HttpListenerResponse response, string jwt, bool secure = false)
        {
            var cookie = new Cookie(CookieName, jwt)
            {
                HttpOnly = true,
                Secure = secure, // switch to true when you serve over HTTPS
                Path = "/"
            };
            response.Cookies.Add(cookie);
        }

        public static void ClearAuthCookie(HttpListenerResponse response, bool secure = false)
        {
            var cookie = new Cookie(CookieName, "")
            {
                HttpOnly = true,
                Secure = secure,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(-1)
            };
            response.Cookies.Add(cookie);
        }
    }
}
