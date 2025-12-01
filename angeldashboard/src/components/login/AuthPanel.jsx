import { useStyles } from "../../context/StyleContext.jsx";

export default function AuthPanel({
    isAuth,
    authLoading,
    error,
    user,
    onLogin,
    onGoDashboard,
}) {
    const { styles, getButton, getGradientText } = useStyles();

    return (
        <div className={`${styles.layout.page} flex items-center justify-center relative`}>
            <div className={`${styles.layout.card} w-[340px] text-center relative`}>

                {/* Title */}
                <h1 className={getGradientText("title", "text-3xl mb-4 relative z-10")}>
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

                {/* Not logged in */}
                {!isAuth && !authLoading && (
                    <>
                        <p className="relative z-10 opacity-85 mb-6 text-[0.95rem]">
                            Log in with your Discord account to manage AngelBot.
                        </p>

                        <button
                            type="button"
                            onClick={onLogin}
                            className={getButton(
                                "primary",
                                "md",
                                "w-full flex items-center justify-center gap-2"
                            )}
                        >
                            <span>💠</span>
                            <span>Login with Discord</span>
                        </button>
                    </>
                )}

                {/* Already logged in */}
                {isAuth && !authLoading && (
                    <>
                        <p className="relative z-10 opacity-85 mb-6 text-[0.95rem]">
                            You’re already logged in as{" "}
                            <strong className="font-semibold text-(--accent-soft)">
                                {user?.username}
                            </strong>.
                        </p>

                        <button
                            type="button"
                            onClick={onGoDashboard}
                            className={getButton(
                                "primary",
                                "md",
                                "w-full flex items-center justify-center gap-2"
                            )}
                        >
                            <span>💠</span>
                            <span>Go to Dashboard</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
