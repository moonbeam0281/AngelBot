import { createContext, useContext, useEffect, useState } from "react";
import CONFIG from "../config";
import {
    loadAngelSession,
    saveAngelSession,
    clearAngelSession,
    touchAngelSession
} from "../handlers/sessionHandler";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [lastActiveAt, setLastActiveAt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = loadAngelSession();
        if (session?.user) {
            setUser(session.user);
            setLastActiveAt(session.lastActiveAt);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!user) return;

        const bump = () => {
            const updated = touchAngelSession();
            if (updated) setLastActiveAt(updated.lastActiveAt);
        };

        window.addEventListener("click", bump);
        window.addEventListener("keydown", bump);

        return () => {
            window.removeEventListener("click", bump);
            window.removeEventListener("keydown", bump);
        };
    }, [user]);

    const AUTH_API_BASE = CONFIG.API_BASE;

    const loginWithDiscord = () => {
        window.location.href = `${AUTH_API_BASE}/auth/discord/login`;
    };

    const setAuthFromSession = (session) => {
        if (!session?.user) return;
        const stored = saveAngelSession(session.user);
        setUser(stored.user);
        setLastActiveAt(stored.lastActiveAt);
    };

    const logout = () => {
        clearAngelSession();
        setUser(null);
        setLastActiveAt(null);
    };

    const isAuth = !!user;

    const value = {
        user,
        lastActiveAt,
        isAuth,
        loading,
        loginWithDiscord,
        logout,
        setAuthFromSession
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
