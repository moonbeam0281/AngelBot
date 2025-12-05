const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_URL = `http://localhost:5005`;

function resolveApiBase() {
    if (VITE_API_BASE_URL) {
        return `${VITE_API_BASE_URL}`.replace(/\/$/, "");
    }

    return DEFAULT_URL;
}

export const CONFIG = {
    VITE_API_BASE_URL: resolveApiBase(),
    DEBUG: import.meta.env.DEV ?? false,
    VERSION: "1.0.0"
};

export default CONFIG;