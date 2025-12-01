import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import AuthLoadingScreen from "../components/login/AuthLoadingScreen.jsx";
import AuthPanel from "../components/login/AuthPanel.jsx";

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

    const handleLogin = () => {
        setError("");
        startDiscordLogin();
    };

    const handleGoDashboard = () => {
        navigate("/dashboard");
    };

    useEffect(() => {
        if (loading) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

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
            <AuthLoadingScreen message="Checking session..." />
        );
    }

    return (
        <AuthPanel
            isAuth={isAuth}
            authLoading={authLoading}
            error={error}
            user={user}
            onLogin={handleLogin}
            onGoDashboard={handleGoDashboard}
        />
    );
}
