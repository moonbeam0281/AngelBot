import { useEffect, useState } from "react";
import { callApiPost } from "../handlers/apiClientHandler";

export default function Verify() {
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
        setMessage("Solve the captcha below to complete your verification.");

        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        setCaptchaA(a);
        setCaptchaB(b);
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
        <main
            className="
                min-h-screen
                flex items-center justify-center
                px-4
                bg-[radial-gradient(circle_at_top,#1b2238,#050716_60%,#02030a)]
                text-text-main
                relative
            "
        >
            {/* soft glow behind card */}
            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    flex items-center justify-center
                "
            >
                <div
                    className="
                        h-64 w-64
                        rounded-full
                        bg-[radial-gradient(circle,rgba(143,213,255,0.45),transparent_70%)]
                        blur-3xl
                        opacity-60
                    "
                />
            </div>

            {/* Card */}
            <section
                className="
                    relative z-10
                    w-full max-w-md
                    rounded-2xl
                    border border-[rgba(135,206,255,0.35)]
                    bg-bg-soft
                    shadow-angel-soft
                    px-6 py-7 md:px-8 md:py-8
                    overflow-hidden
                "
            >
                {/* top halo */}
                <div
                    className="
                        pointer-events-none
                        absolute -top-24 left-1/2
                        h-56 w-56
                        -translate-x-1/2
                        rounded-full
                        bg-[radial-gradient(circle,rgba(135,206,255,0.75),transparent_70%)]
                        blur-[42px]
                        opacity-70
                    "
                />

                {!isSuccess && !isError && (
                    <>
                        <header className="relative z-10 mb-4">
                            <h1
                                className="
                                    text-xl md:text-2xl font-semibold mb-1
                                    angel-gradient-text
                                "
                            >
                                AngelBot Verification
                            </h1>
                            <p className="text-sm md:text-[0.95rem] opacity-85">
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
                                    className="
                                        flex-1
                                        rounded-md
                                        border border-[rgba(135,206,255,0.4)]
                                        bg-[rgba(4,10,24,0.9)]
                                        px-3 py-2
                                        text-sm
                                        text-text-main
                                        placeholder:text-[rgba(219,233,255,0.6)]
                                        focus:outline-none
                                        focus:border-[rgba(135,206,255,0.9)]
                                        focus:shadow-[0_0_8px_rgba(135,206,255,0.3)]
                                    "
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

                        <button
                            type="button"
                            onClick={handleVerifyClick}
                            disabled={isLoading}
                            className={`
                                relative z-10
                                mt-2
                                w-full
                                rounded-xl
                                bg-linear-to-r from-sky-300 to-purple-300
                                px-4 py-2.5
                                text-sm md:text-[0.95rem]
                                font-semibold
                                text-slate-900
                                flex items-center justify-center gap-2
                                shadow-[0_0_10px_rgba(135,206,255,0.3)]
                                transition
                                hover:brightness-110 hover:shadow-[0_0_16px_rgba(135,206,255,0.45)]
                                disabled:opacity-60 disabled:cursor-not-allowed
                            `}
                        >
                            <span>{isLoading ? "Verifying..." : "Verify me"}</span>
                        </button>
                    </>
                )}

                {isSuccess && (
                    <div className="relative z-10">
                        <h1 className="text-xl md:text-2xl font-semibold mb-2 text-emerald-300">
                            ✅ Verified
                        </h1>
                        <p className="text-sm md:text-[0.95rem] opacity-85 mb-4">
                            {message}
                        </p>
                        <a
                            href="https://discord.com/app"
                            className="
                                inline-block
                                text-sm font-medium
                                text-(--accent-soft)
                                hover:underline
                            "
                        >
                            Back to Discord
                        </a>
                    </div>
                )}

                {isError && (
                    <div className="relative z-10">
                        <h1 className="text-xl md:text-2xl font-semibold mb-2 text-[#ffb0b0]">
                            ❌ Verification Error
                        </h1>
                        <p className="text-sm md:text-[0.95rem] opacity-85 mb-4">
                            {message}
                        </p>
                        <a
                            href="https://discord.com/app"
                            className="
                                inline-block
                                text-sm font-medium
                                text-(--accent-soft)
                                hover:underline
                            "
                        >
                            Back to Discord
                        </a>
                    </div>
                )}

                {/* Debug (optional) */}
                {details && (
                    <pre
                        className="
                            relative z-10 mt-5
                            max-h-40 overflow-auto
                            rounded-md
                            bg-[rgba(0,0,0,0.35)]
                            border border-[rgba(135,206,255,0.35)]
                            px-3 py-2
                            text-[0.7rem]
                            opacity-60
                        "
                    >
                        {JSON.stringify(details, null, 2)}
                    </pre>
                )}
            </section>
        </main>
    );
}
