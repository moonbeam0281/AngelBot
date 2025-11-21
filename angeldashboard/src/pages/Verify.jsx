import { useEffect, useState } from "react";
import { callApiPost } from "../handlers/apiClientHandler";

export default function Verify() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("Preparing your verification...");
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const guildId = params.get("guildId");
        const token = params.get("token");

        if (!guildId || !token) {
            setStatus("error");
            setMessage("Invalid verification link. Missing guild or token.");
            return;
        }

        setDetails({ guildId, token });

        (async () => {

            try {
                const res = await callApiPost("/verify/user/server", {
                    guildId: Number(guildId),
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
        })();
    }, []);

    return (
        <main className="verify-page">
            <div className="verify-card">
                {status === "loading" && (
                    <>
                        <h1>Verifying you...</h1>
                        <p>Please wait a moment.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1>✅ Verified</h1>
                        <p>{message}</p>
                        <a href="https://discord.com/app" className="back-link">
                            Back to Discord
                        </a>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1>❌ Verification Error</h1>
                        <p>{message}</p>
                        <a href="https://discord.com/app" className="back-link">
                            Back to Discord
                        </a>
                    </>
                )}

                {details && (
                    <pre style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.6 }}>
                        {JSON.stringify(details, null, 2)}
                    </pre>
                )}
            </div>
        </main>
    );
}
