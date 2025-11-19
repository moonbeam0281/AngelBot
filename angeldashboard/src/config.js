const API_PORT = import.meta.env.VITE_BOT_API_PORT;

const DEFAULT_PORT = 5005;
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}`;

function resolveApiBase() {
    if (API_PORT && !isNaN(Number(API_PORT))) {
        return `http://localhost:${API_PORT}`.replace(/\/$/, "");
    }

    return DEFAULT_URL;
}

export const CONFIG = {
    API_BASE: resolveApiBase(),
    DEBUG: import.meta.env.DEV ?? false,
    VERSION: "1.0.0"
};

export default CONFIG;