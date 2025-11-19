// src/pages/Login.jsx
import { useEffect, useState } from "react";
import CONFIG from "../config";
import { exchangeDiscordCode } from "../apiHandlers/angelApiClient";

const AUTH_API_BASE = CONFIG.API_BASE;

export default function Login() {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("angelUser");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) return;

        setLoading(true);
        setError("");

        exchangeDiscordCode(code).then(result => {
            if(!result.success){
                setError(result.error);
            } else {
                setUser(result.user);
                window.history.replaceState({}, "", "/login");
            }
        }).catch(err => {
            console.error(err);
            setError(err.message || "Auth Failed");
        }).finally(() => {
            setLoading(false);
        })

    }, []);

    const handleDiscordLogin = () => {
        window.location.href = `${AUTH_API_BASE}/auth/discord/login`;
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("angelUser");
    };

    return (
        <div className="login-root">
            <div className="login-card">
                <h1 className="login-title">Angel Dashboard</h1>

                {loading && <p>Connecting to Discord...</p>}
                {error && <p style={{ color: "salmon" }}>Error: {error}</p>}

                {user ? (
                    <>
                        <p className="login-subtitle">
                            Logged in as <strong>{user.username}</strong>
                            {user.discriminator && <span>#{user.discriminator}</span>}
                        </p>
                        <button className="login-discord-btn" onClick={handleLogout}>
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <p className="login-subtitle">
                            Log in with your Discord account to manage AngelBot.
                        </p>
                        <button className="login-discord-btn" onClick={handleDiscordLogin} disabled={loading}>
                            <span className="login-discord-icon">💠</span>
                            <span>Login with Discord</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
