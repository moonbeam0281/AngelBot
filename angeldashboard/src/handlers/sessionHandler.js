const STORAGE_KEY = "angelUser";
const INACTIVITY_LIMIT_DAYS = 7;
const INACTIVITY_LIMIT_MS = INACTIVITY_LIMIT_DAYS * 24 * 60 * 60 * 1000;

function normalizeSession(rawValue) {
    // Old format: plain user object
    if (rawValue && !rawValue.user) {
        return {
            user: rawValue,
            lastActiveAt: Date.now()
        };
    }

    // New format: { user, lastActiveAt }
    if (rawValue?.user) {
        return {
            user: rawValue.user,
            lastActiveAt: rawValue.lastActiveAt || Date.now()
        };
    }

    return null;
}

export function loadAngelSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        const session = normalizeSession(parsed);
        if (!session?.user) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        const lastActive = typeof session.lastActiveAt === "number"
            ? session.lastActiveAt
            : new Date(session.lastActiveAt).getTime();

        if (!Number.isFinite(lastActive)) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        const diff = Date.now() - lastActive;
        if (diff > INACTIVITY_LIMIT_MS) {
            // expired from inactivity
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return { ...session, lastActiveAt: lastActive };
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function saveAngelSession(user) {
    const session = {
        user,
        lastActiveAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
}

export function touchAngelSession() {
    const session = loadAngelSession();
    if (!session) return null;

    const updated = { ...session, lastActiveAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function clearAngelSession() {
    localStorage.removeItem(STORAGE_KEY);
}
