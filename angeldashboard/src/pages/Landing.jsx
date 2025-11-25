import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import VeilBackground from "../components/landing/VeilBackground.jsx";
import angelBotImage from "../assets/angelbot.png";

export default function Landing() {
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
        <div className="relative min-h-screen w-full overflow-hidden bg-bg-main text-text-main">
            {/* Background veiled shader */}
            <VeilBackground
                hueShift={205}
                scanlineIntensity={0.58}
                scanlineFrequency={1.6}
                speed={1.3}
                warpAmount={2.2}
                resolutionScale={1.5}
            />


            {/* Foreground content */}
            <div
                className="
                    relative z-10
                    flex min-h-screen flex-col
                    items-center justify-center
                    px-4 py-10
                    md:px-8
                "
            >
                <div
                    className="
                        flex flex-col items-center gap-6
                        text-center
                        max-w-3xl
                    "
                >
                    {/* Glowy bot image in the middle */}
                    <div className="relative">
                        {/* Colored aura that matches the gradient */}
                        <div
                            className="
            absolute -inset-10
            rounded-full
            bg-[radial-gradient(circle_at_center,var(--accent-soft)_0%,#ff9ad5_40%,#ffd27f_70%,transparent_80%)]
            blur-3xl
            opacity-60
            animate-[angel-pulse_6s_ease-in-out_infinite]
        "
                        />

                        {/* White pulsing halo */}
                        <div
                            className="
            absolute -inset-4
            rounded-full
            bg-white/40
            blur-2xl
            opacity-40
            animate-[angel-pulse_4s_ease-in-out_infinite]
        "
                        />

                        <div
                            className="
            relative
            h-40 w-40
            sm:h-44 sm:w-44
            md:h-48 md:w-48
            rounded-full
            border border-accent-soft/80
            bg-bg-panel
            shadow-angel-strong
            overflow-hidden
            flex items-center justify-center
        "
                        >
                            <img
                                src={angelBotImage}
                                alt="AngelBot"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>


                    {/* Animated gradient title */}
                    <h1
                        className="
                            angel-gradient-text
                            text-[2.2rem]
                            sm:text-[2.8rem]
                            md:text-[3.2rem]
                            tracking-[0.2em]
                            uppercase
                            font-semibold
                        "
                    >
                        AngelBot
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="
                            max-w-xl
                            text-[0.95rem]
                            md:text-[1.02rem]
                            opacity-85
                        "
                    >
                        Your celestial Discord companion — keeping your servers
                        safe, cozy, and just a little bit magical.
                    </p>

                    {/* Button area */}
                    <div className="mt-2 flex flex-col items-center gap-2">
                        {isAuth && (
                            <p className="text-sm opacity-80">
                                Welcome back,{" "}
                                <span className="font-semibold text-accent">
                                    {user?.username}
                                </span>
                                .
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleClick}
                            className="
        angel-button
        inline-flex items-center justify-center
        gap-2
        rounded-xl
        border border-accent-soft/70
        bg-accent
        px-6 py-2.5
        text-[0.95rem]
        font-semibold
        text-bg-main
        shadow-angel-soft
        transition
        hover:shadow-angel-strong
        hover:brightness-105
        focus:outline-none
        focus:ring-2 focus:ring-accent-soft/80
        cursor-pointer
    "
                        >
                            <span>💠</span>
                            <span className="angel-button-label">
                                {isAuth ? "Open Dashboard" : "Login with Discord"}
                            </span>
                        </button>

                        {!isAuth && (
                            <span className="mt-1 text-xs opacity-70">
                                We’ll send you to Discord for a quick, safe login.
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
