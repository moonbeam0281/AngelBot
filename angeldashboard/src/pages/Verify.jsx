import { useEffect, useState } from "react";
import { callApiPost, callApiGet } from "../handlers/apiClientHandler";
import { useStyles } from "../context/StyleContext.jsx";

export default function Verify() {
    const { styles, getButton, getGradientText } = useStyles();

    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("Preparing your verification...");
    const [details, setDetails] = useState(null);

    const [guildId, setGuildId] = useState(null);
    const [token, setToken] = useState(null);

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

        setStatus("loading");
        setMessage("Checking your verification link…");

        const checkToken = async () => {
            try {
                const route = `/verify/token?guildId=${encodeURIComponent(g)}&token=${encodeURIComponent(t)}`;

                const res = await callApiGet(route);

                if (!res.success) {
                    setStatus("error");
                    setMessage(res.error || "Could not validate verification link.");
                    return;
                }

                const payload = res.data;

                if (!payload?.success) {
                    const errText = (payload?.error || "").toLowerCase();

                    if (errText === "expired") {
                        setStatus("error");
                        setMessage(
                            "This verification link has expired. Please request a new one from the server."
                        );
                    } else {
                        setStatus("error");
                        setMessage(
                            payload?.error ||
                            "This verification link is invalid or no longer active."
                        );
                    }
                    return;
                }

                // ✅ token is valid → prepare captcha
                const a = Math.floor(Math.random() * 9) + 1;
                const b = Math.floor(Math.random() * 9) + 1;
                setCaptchaA(a);
                setCaptchaB(b);

                setStatus("idle");
                setMessage("Solve the captcha below to complete your verification.");
            } catch (err) {
                console.error(err);
                setStatus("error");
                setMessage(
                    "Could not contact the verification server. Please try again later."
                );
            }
        };

        checkToken();
    }, []);


    const handleVerifyClick = async () => {
        if (!guildId || !token) return;

        const expected = captchaA + captchaB;
        const trimmed = captchaInput.trim();
        const given = Number(trimmed);

        if (!trimmed) {
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
                guildId,
                token,
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
                "You have been verified for this server. You can now return to Discord."
            );
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(
                err?.error || "Something went wrong while verifying you."
            );
        }
    };

    const isLoading = status === "loading";
    const isError = status === "error";
    const isSuccess = status === "success";

    return (
        <main className={`${styles.layout.page} flex items-center justify-center px-4 relative`}>
            {/* soft glow behind card */}

            {/* Card */}
            <section className={`${styles.layout.card} relative z-10 w-full max-w-md px-6 py-7 md:px-8 md:py-8 overflow-hidden`}>

                {/* --- DEFAULT STATE: captcha --- */}
                {!isSuccess && !isError && (
                    <>
                        <header className="relative z-10 mb-4">
                            <h1
                                className={getGradientText(
                                    "title",
                                    "text-xl md:text-2xl font-semibold mb-1 text-center"
                                )}
                            >
                                AngelBot Verification
                            </h1>
                            <p className={`${styles.text.base} text-sm md:text-[0.95rem] opacity-85`}>
                                {message}
                            </p>
                        </header>

                        {/* Captcha block */}
                        <div className="relative z-10 mb-4">
                            <p className="mb-2 text-[0.9rem] opacity-90">
                                Please prove you&apos;re human ✨
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-[0.95rem] min-w-[90px] text-(--accent-soft)">
                                    {captchaA} + {captchaB} =
                                </span>
                                <input
                                    type="text"
                                    className={`${styles.search.input}`}
                                    value={captchaInput}
                                    onChange={(e) =>
                                        setCaptchaInput(e.target.value)
                                    }
                                    disabled={isLoading}
                                    placeholder="Your answer"
                                />
                            </div>
                            {captchaError && (
                                <p className="mt-2 text-xs text-[#ff9b9b]">
                                    {captchaError}
                                </p>
                            )}
                        </div>

                        {/* Verify button */}
                        <button
                            type="button"
                            onClick={handleVerifyClick}
                            disabled={isLoading}
                            className={getButton(
                                "primary",
                                "md",
                                "relative z-10 mt-2 w-full flex items-center justify-center gap-2"
                            )}
                        >
                            <span>{isLoading ? "Verifying..." : "Verify me"}</span>
                        </button>
                    </>
                )}

                {/* --- SUCCESS --- */}
                {isSuccess && (
                    <div className="relative z-10">
                        <h1 className="text-xl md:text-2xl font-semibold mb-2 text-emerald-300">
                            ✅ Verified
                        </h1>
                        <p className={`${styles.text.base} text-sm md:text-[0.95rem] opacity-85 mb-4`}>
                            {message}
                        </p>
                        <a
                            href="https://discord.com/app"
                            className={getButton(
                                "primary",
                                "md",
                                "relative z-10 mt-2 w-full flex items-center justify-center gap-2"
                            )}
                        >
                            Back to Discord
                        </a>
                    </div>
                )}

                {/* --- ERROR --- */}
                {isError && (
                    <div className="relative z-10">
                        <h1 className="text-xl md:text-2xl font-semibold mb-2 text-[#ffb0b0]">
                            ❌ Verification Error
                        </h1>
                        <p className={`${styles.text.base} text-sm md:text-[0.95rem] opacity-85 mb-4`}>
                            {message}
                        </p>
                        <a
                            href="https://discord.com/app"
                            className={getButton(
                                "primary",
                                "md",
                                "relative z-10 mt-2 w-full flex items-center justify-center gap-2"
                            )}
                        >
                            Back to Discord
                        </a>
                    </div>
                )}
            </section>
        </main>
    );
}
