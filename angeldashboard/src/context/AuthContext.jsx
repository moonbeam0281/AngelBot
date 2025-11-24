import { createContext, useContext, useEffect, useState } from "react";
import CONFIG from "../config";
import {
    callApiGet,
    callApiPost,
    exchangeDiscordCode,
} from "../handlers/apiClientHandler";

const AuthContext = createContext(null);

function normalizeUser(raw) {
    if (!raw) return null;

    const rawGuilds = raw.commonGuilds ?? raw.CommonGuilds ?? [];

    const commonGuilds = rawGuilds.map(g => ({
        guildId: g.guildId ?? g.GuildId ?? "",
        guildName: g.guildName ?? g.GuildName ?? "",
        guildAvatar: g.guildAvatar ?? g.GuildAvatar ?? null,
        guildBanner: g.guildBanner ?? g.GuildBanner ?? null,
        permission: g.permission ?? g.Permission ?? "CommonUser"
    }));

    return {
        id: raw.id ?? raw.Id ?? null,
        username: raw.username ?? raw.Username ?? "",
        discriminator: raw.discriminator ?? raw.Discriminator ?? "0",
        avatar: raw.avatar ?? raw.Avatar ?? null,
        commonGuilds
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const AUTH_API_BASE = CONFIG.API_BASE;
    const isAuth = !!user;

    useEffect(() => {
        let cancelled = false;

        callApiGet("/auth/me", true)
            .then((res) => {
                if (cancelled) return;

                if (res.success && res.data?.ok) {
                    const normalised = normalizeUser(res.data.user);
                    setUser(normalised);
                } else {
                    setUser(null);
                }
            })
            .catch(() => {
                if (!cancelled) setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const startDiscordLogin = () => {
        window.location.href = `${AUTH_API_BASE}/auth/discord/login`;
    };

    const completeLogin = async (code) => {
        const res = await exchangeDiscordCode(code);
        if (!res.success) {
            throw new Error(res.error || "Auth failed");
        }
        const normalised = normalizeUser(res.user);
        setUser(normalised);
        return res;
    };

    const logout = async () => {
        try {
            try {
                return await callApiPost("/auth/logout", {}, true);
            } catch { }
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        isAuth,
        loading,
        startDiscordLogin,
        completeLogin,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
