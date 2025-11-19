import CONFIG from "../config";

const API_BASE = CONFIG.API_BASE.replace(/\/$/, "");

export function angelApiPost(route, body) {
    return new Promise(async (resolve, reject) => {
        try {
            const cleanRoute = route.replace(/^\//, "");
            const url = `${API_BASE}/${cleanRoute}`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body || {})
            });

            if (!res.ok) {
                return reject({
                    success: false,
                    data: [],
                    error: `Request failed (${res.status})`
                });
            }

            const data = await res.json();
            resolve({
                success: true,
                data,
                message: `Data from route: ${route}`
            });
        } catch (e) {
            reject({
                success: false,
                data: [],
                error: `Error while running angelApiPost\n${e}`
            });
        }
    });
}

export function exchangeDiscordCode(code) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await angelApiPost("/auth/discord/exchange", { code });

            if (!res.success || !res.data?.ok) {
                return reject({
                    success: false,
                    error: res.data?.error || "Failed to authenticate"
                });
            }

            const user = res.data.user;
            localStorage.setItem("angelUser", JSON.stringify(user));

            resolve({
                success: true,
                user
            });
        } catch (e) {
            reject({
                success: false,
                error: `Error in OAuth exchange:\n${e?.error || e?.message || String(e)}`
            });
        }
    });
}
