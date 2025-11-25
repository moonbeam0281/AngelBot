import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("dark");

    // Load on mount
    useEffect(() => {
        const stored = localStorage.getItem("angel-theme");
        const initial = stored === "light" || stored === "dark" ? stored : "dark";
        setTheme(initial);
        document.documentElement.dataset.theme = initial;
    }, []);

    // Apply + persist
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("angel-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
