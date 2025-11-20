import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const {
        user,
        isAuth,
        loading,
        startDiscordLogin,
        completeLogin,
    } = useAuth();

    const [error, setError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const navigate = useNavigate();

    const handledCodeRef = useRef(false);

    useEffect(() => {
        if (loading) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (isAuth) {
            navigate("/dashboard", { replace: true });
            return;
        }

        if (!code || handledCodeRef.current) return;

        handledCodeRef.current = true;
        setAuthLoading(true);
        setError("");

        completeLogin(code)
            .then(() => {
                window.history.replaceState({}, "", "/login");
                navigate("/dashboard", { replace: true });
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || "Authentication failed");
            })
            .finally(() => {
                setAuthLoading(false);
            });

    }, [loading, isAuth, completeLogin, navigate]);

    if (loading) {
        return (
            <div className="login-root">
                <div className="login-card">
                    <h1 className="login-title">Angel Dashboard</h1>
                    <p>Checking session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-root">
            <div className="login-card">
                <h1 className="login-title">Angel Dashboard</h1>

                {authLoading && <p>Connecting to Discord...</p>}
                {error && <p style={{ color: "salmon" }}>Error: {error}</p>}

                {!isAuth && !authLoading && (
                    <>
                        <p className="login-subtitle">
                            Log in with your Discord account to manage AngelBot.
                        </p>
                        <button
                            className="login-discord-btn"
                            onClick={startDiscordLogin}
                        >
                            <span className="login-discord-icon">💠</span>
                            <span>Login with Discord</span>
                        </button>
                    </>
                )}

                {isAuth && !authLoading && (
                    <>
                        <p className="login-subtitle">
                            You are already logged in as{" "}
                            <strong>{user?.username}</strong>.
                        </p>
                        <button
                            className="login-discord-btn"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
