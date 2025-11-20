import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeDiscordCode } from "../apiHandlers/angelApiClient";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { user: ctxUser, setAuthFromSession, loginWithDiscord, logout } = useAuth();
    const [localUser, setLocalUser] = useState(() => {
        try {
            const saved = localStorage.getItem("angelUser");
            return saved ? JSON.parse(saved)?.user || JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const user = ctxUser || localUser;

    const handledCodeRef = useRef(false);

    useEffect(() => {
        if (handledCodeRef.current) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) return;

        handledCodeRef.current = true;

        setLoading(true);
        setError("");

        exchangeDiscordCode(code)
            .then(result => {
                if (!result.success) {
                    setError(result.error);
                } else {
                    setAuthFromSession(result.session);
                    setLocalUser(result.session.user);

                    navigate("/dashboard", { replace: true });
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.error || err.message || "Auth Failed");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [navigate, setAuthFromSession]);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <div className="login-root">
            <div className="login-card">
                <h1 className="login-title">Angel login page</h1>

                {loading && <p>Connecting to Discord...</p>}
                {error && <p style={{ color: "salmon" }}>Error: {error}</p>}

                {user ? (
                    <>
                        <p className="login-subtitle">
                            Logged in as <strong>{user.username}</strong>
                        </p>
                        <button className="login-discord-btn" onClick={handleLogout}>
                            Log out
                        </button>

                        <button className="login-discord-btn" onClick={navigate("/dashboard", { replace: true })}>
                            Dashboard
                        </button>
                    </>
                ) : (
                    <>
                        <p className="login-subtitle">
                            Log in with your Discord account to manage AngelBot.
                        </p>
                        <button
                            className="login-discord-btn"
                            onClick={loginWithDiscord}
                            disabled={loading}
                        >
                            <span className="login-discord-icon">💠</span>
                            <span>Login with Discord</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
