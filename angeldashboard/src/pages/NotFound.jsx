import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="login-root">
            <div className="login-card">
                <h1 className="login-title">404 – Not Found</h1>
                <p className="login-subtitle">
                    The page you’re looking for doesn’t exist.
                </p>
                <Link to="/" className="login-discord-btn" style={{ textDecoration: "none" }}>
                    Go back home
                </Link>
            </div>
        </div>
    );
}
