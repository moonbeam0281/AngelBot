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

    const handleLogin = () => {
        setError("");
        startDiscordLogin();
    };

    useEffect(() => {
        if (loading) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (isAuth) {
            // navigate("/dashboard", { replace: true });
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
            <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main">
                <div className="angel-card w-[340px] text-center">

                    <div className="mx-auto mb-6 h-10 w-10 rounded-full 
                        bg-linear-to-br from-accent to-accent-soft
                        animate-[orb-spin_1.4s_linear_infinite]"
                    />

                    <h1 className="text-3xl angel-gradient-text mb-2">
                        Angel Dashboard
                    </h1>

                    <p className="opacity-80 text-sm">Checking session...</p>
                </div>
            </div>
        );
    }

    // ----------------------------
    // Login Panel
    // ----------------------------
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main relative">

            <div className="angel-card w-[340px] text-center relative">

                {/* Pulsing glow behind title */}
                <div
                    className="
                        pointer-events-none absolute -top-20 left-1/2
                        h-[180px] w-[180px]
                        -translate-x-1/2
                        rounded-full
                        bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)]
                        blur-[55px]
                        animate-[login-glow_5s_ease-in-out_infinite]
                    "
                />

                <h1 className="text-3xl angel-gradient-text mb-4 relative z-10">
                    Angel Dashboard
                </h1>

                {/* Loading text */}
                {authLoading && (
                    <p className="relative z-10 text-sm opacity-80 mb-3">
                        Connecting to Discord...
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p className="relative z-10 text-sm text-[#ff9b9b] mb-3">
                        Error: {error}
                    </p>
                )}

                {/* Login Button */}
                {!isAuth && !authLoading && (
                    <>
                        <p className="relative z-10 opacity-85 mb-6 text-[0.95rem]">
                            Log in with your Discord account to manage AngelBot.
                        </p>

                        <button
                            type="button"
                            onClick={handleLogin}
                            className="
                                angel-button w-full py-3 rounded-xl
                                bg-accent text-bg-main font-semibold
                                flex items-center justify-center gap-2
                                shadow-angel-soft
                                transition
                                hover:shadow-angel-strong
                                cursor-pointer
                            "
                        >
                            <span>💠</span>
                            <span className="angel-button-label">Login with Discord</span>
                        </button>
                    </>
                )}

                {/* Already logged in */}
                {isAuth && !authLoading && (
                    <>
                        <p className="relative z-10 opacity-85 mb-6 text-[0.95rem]">
                            You’re already logged in as{" "}
                            <strong className="text-accent-soft font-semibold">
                                {user?.username}
                            </strong>.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="
                                angel-button w-full py-3 rounded-xl
                                bg-accent text-bg-main font-semibold
                                flex items-center justify-center gap-2
                                shadow-angel-soft
                                transition
                                hover:shadow-angel-strong
                                cursor-pointer
                            "
                        >
                            <span>💠</span>
                            <span className="angel-button-label">Go to Dashboard</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
