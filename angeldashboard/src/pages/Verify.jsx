import { useEffect, useState } from "react";
import { callApiPost } from "../handlers/apiClientHandler";

export default function Verify() {
    const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState("Preparing your verification...");
    const [details, setDetails] = useState(null);

    const [guildId, setGuildId] = useState(null);
    const [token, setToken] = useState(null);

    // captcha state
    const [captchaA, setCaptchaA] = useState(0);
    const [captchaB, setCaptchaB] = useState(0);
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaError, setCaptchaError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const g = params.get("guildId");
        const t = params.get("token");

        if (!g || !t) {
            setStatus("error");
            setMessage("Invalid verification link. Missing guild or token.");
            return;
        }

        setGuildId(g);
        setToken(t);
        setDetails({ guildId: g, token: t });
        setMessage("Solve the captcha below to complete your verification.");

        // generate simple captcha
        const a = Math.floor(Math.random() * 9) + 1; // 1–9
        const b = Math.floor(Math.random() * 9) + 1;
        setCaptchaA(a);
        setCaptchaB(b);
    }, []);

    const handleVerifyClick = async () => {
        if (!guildId || !token) return;

        // basic captcha validation
        const expected = captchaA + captchaB;
        const given = Number(captchaInput.trim());

        if (!captchaInput.trim()) {
            setCaptchaError("Please solve the captcha to continue.");
            return;
        }

        if (Number.isNaN(given) || given !== expected) {
            setCaptchaError("Incorrect answer. Please try again.");
            return;
        }

        setCaptchaError("");
        setStatus("loading");
        setMessage("Verifying you…");

        try {
            const res = await callApiPost("/verify/user/server", {
                guildId, // keep as string, backend handles it
                token
            });

            if (!res.success) {
                setStatus("error");
                setMessage(res.error || "Verification failed.");
                return;
            }

            const data = res.data;

            setStatus("success");
            setMessage(
                data?.message ||
                `You have been verified for this server. You can now return to Discord.`
            );
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(err.error || "Something went wrong while verifying you.");
        }
    };

    const isLoading = status === "loading";
    const isError = status === "error";
    const isSuccess = status === "success";

    return (
        <main className="login-root verify-root">
            <div className="login-card verify-card">
                {!isSuccess && !isError && (
                    <>
                        <h1 className="verify-title">AngelBot Verification</h1>
                        <p className="verify-subtitle">
                            {message}
                        </p>

                        {/* Captcha block */}
                        <div className="verify-captcha-block">
                            <p className="verify-captcha-label">
                                Please prove you&apos;re human ✨
                            </p>
                            <div className="verify-captcha-row">
                                <span className="verify-captcha-question">
                                    {captchaA} + {captchaB} = 
                                </span>
                                <input
                                    type="text"
                                    className="verify-input"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Your answer"
                                />
                            </div>
                            {captchaError && (
                                <p className="verify-error-text">{captchaError}</p>
                            )}
                        </div>

                        <button
                            className="login-discord-btn verify-submit-btn"
                            onClick={handleVerifyClick}
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify me"}
                        </button>
                    </>
                )}

                {isSuccess && (
                    <>
                        <h1 className="verify-title">✅ Verified</h1>
                        <p className="verify-subtitle">{message}</p>
                        <a href="https://discord.com/app" className="back-link">
                            Back to Discord
                        </a>
                    </>
                )}

                {isError && (
                    <>
                        <h1 className="verify-title">❌ Verification Error</h1>
                        <p className="verify-subtitle">{message}</p>
                        <a href="https://discord.com/app" className="back-link">
                            Back to Discord
                        </a>
                    </>
                )}

                {details && (
                    <pre className="verify-debug">
                        {JSON.stringify(details, null, 2)}
                    </pre>
                )}
            </div>
        </main>
    );
}
