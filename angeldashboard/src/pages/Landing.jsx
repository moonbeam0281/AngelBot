import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import VeilBackground from "../components/landing/VeilBackground.jsx";

export default function Landing() {
    const [hovering, setHovering] = useState(false);
    const { isAuth, user, startDiscordLogin } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (isAuth) {
            navigate("/dashboard");
        } else {
            startDiscordLogin();
        }
    };

    return (
        <div className="landing-root">
            <VeilBackground />
            <div className="landing-overlay">
                <div className="landing-hero">
                    <div className="landing-logo-circle">✨</div>
                    <h1 className="landing-title">AngelBot</h1>
                    <p className="landing-subtitle">
                        Your celestial Discord companion, watching over your servers.
                    </p>
                </div>

                <div
                    className="landing-bottom"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    <div className="landing-arrow">⬇</div>

                    <div className="landing-login-shell">
                        {hovering && (
                            <div
                                className="landing-login-bubble"
                                onClick={handleClick}
                            >
                                {isAuth ? (
                                    <>
                                        <p>
                                            Welcome back,{" "}
                                            <span className="landing-username">
                                                {user?.username}
                                            </span>
                                            .
                                        </p>
                                        <p className="login-cta">
                                            Click to open your dashboard ✨
                                        </p>
                                        <button className="login-btn">
                                            Dashboard
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p>Heey~ It’s AngelBot 💫</p>
                                        <p className="login-cta">
                                            Log in with Discord to continue, okay? 💖
                                        </p>
                                        <button className="login-btn">
                                            Login with Discord
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
