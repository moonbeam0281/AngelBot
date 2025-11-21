import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { callApiGet } from "../handlers/apiClientHandler";

const BotInfoContext = createContext(null);

export function BotInfoProvider({ children }) {
    const [botInfo, setBotInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBotInfo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            await callApiGet("/info/bot").then(res =>{
                if(res.success && res.data?.ok)
                {
                    const raw = res.data.bot ?? res.data.bot;
                    setBotInfo({
                        id: raw.id,
                        name: raw.name,
                        avatar: raw.avatar,
                        banner: raw.banner,
                        serverCount: raw.serverCount,
                        status: raw.status,
                        userCount: raw.usersCount
                    });
                }
            }).catch((e) => {console.error("Failed to load bot info:", e)});
        } catch (err) {
            console.error("Failed to load bot info:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBotInfo();
    }, [loadBotInfo]);

    const value = {
        botInfo,
        loading,
        error,
        reload: loadBotInfo
    };

    return (<BotInfoContext.Provider value={value}>{children}</BotInfoContext.Provider>);
}

export function useBotInfo() {
    return useContext(BotInfoContext);
}
