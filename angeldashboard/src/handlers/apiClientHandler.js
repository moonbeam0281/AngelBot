import CONFIG from "../config";

const API_BASE = CONFIG.API_BASE.replace(/\/$/, "");

// helper
function normalizeRoute(route) {
    return route.replace(/^\//, "");
}

// -----------------------------
// POST REQUEST (Promise-based)
// -----------------------------
export function callApiPost(route, body = {}, cred = false) {
    return new Promise(async (resolve, reject) => {
        try {
            const clean = normalizeRoute(route);
            const url = `${API_BASE}/${clean}`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
                credentials: cred ? "include" : "omit"
            });

            if (!res.ok) {
                return reject({
                    success: false,
                    error: `Request failed (${res.status})`,
                    data: null
                });
            }

            const data = await res.json();
            resolve({
                success: true,
                data
            });

        } catch (err) {
            reject({
                success: false,
                error: `callApiPost error: ${err}`
            });
        }
    });
}

// -----------------------------
// GET REQUEST (Promise-based)
// -----------------------------
export function callApiGet(route, cred = false) {
    return new Promise(async (resolve, reject) => {
        try {
            const clean = normalizeRoute(route);
            const url = `${API_BASE}/${clean}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                credentials: cred ? "include" : "omit"
            });

            if (!res.ok) {
                return reject({
                    success: false,
                    error: `Request failed (${res.status})`
                });
            }

            const data = await res.json();
            resolve({
                success: true,
                data
            });

        } catch (err) {
            reject({
                success: false,
                error: `callApiGet error: ${err}`
            });
        }
    });
}

export function exchangeDiscordCode(code) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await callApiPost(
                "/auth/discord/exchange",
                { code },
                true
            );

            console.log("[exchangeDiscordCode] API response:", res);

            if (!res.success) {
                return reject({
                    success: false,
                    error: res.error || "Request to backend failed"
                });
            }

            if (!res.data?.ok) {
                return reject({
                    success: false,
                    error: res.data?.error || "Failed to authenticate"
                });
            }

            resolve({
                success: true,
                user: res.data.user
            });

        } catch (err) {
            console.error("[exchangeDiscordCode] Exception:", err);
            reject({
                success: false,
                error: `Error in OAuth exchange:\n${err?.error || err?.message || String(err)}`
            });
        }
    });
}
