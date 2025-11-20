// src/pages/Landing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Landing() {
    const [hovering, setHovering] = useState(false);
    const { isAuth, user, loginWithDiscord } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (isAuth) {
            navigate("/dashboard");
        } else {
            loginWithDiscord();
        }
    };

    return (
        <div className="landing-root">
            <div className="landing-bg">
                <div className="landing-angel-title">
                    <h1>AngelBot</h1>
                    <p>Your celestial Discord companion.</p>
                </div>
            </div>

            <div
                className="landing-bottom-glow"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <div className="landing-arrow">⬇</div>

                {hovering && (
                    <div className="landing-login-bubble" onClick={handleClick}>
                        {isAuth ? (
                            <>
                                <p>
                                    Welcome back, <span className="username">{user?.username}</span>.
                                </p>
                                <p className="login-cta">
                                    Click here to open your dashboard ✨
                                </p>
                                <button className="login-btn">Dashboard</button>
                            </>
                        ) : (
                            <>
                                <p>Heey~ It’s AngelBot 💫</p>
                                <p className="login-cta">
                                    Log in with Discord to continue, okay? 💖
                                </p>
                                <button className="login-btn">Login with Discord</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
