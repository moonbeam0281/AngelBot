import { createContext, useContext, useMemo } from "react";
import { useTheme } from "./ThemeContext";

const StyleContext = createContext(null);

export function StyleProvider({ children }) {
    const { theme } = useTheme();

    const styles = useMemo(() => {
        const isDark = theme === "dark";

        return {
            // GENERAL TEXT
            text: {
                base: "font-sans text-[var(--text-main)]",
                soft: "font-sans text-[var(--text-soft)]",
                muted: "text-[var(--text-muted)]",
                strong: "text-[var(--text-main)] font-semibold",
            },

            // GRADIENT TEXTS
            gradients: {
                title:
                    "bg-clip-text text-transparent bg-[image:var(--angel-gradient)] bg-[length:200%_200%] animate-[angel-gradient_8s_ease-in-out_infinite]",
                soft:
                    "bg-clip-text text-transparent bg-[image:var(--angel-gradient-soft)] bg-[length:200%_200%] animate-[angel-gradient_8s_ease-in-out_infinite]",
                warning:
                    "bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-400",
            },

            //OUTLINES

            outlines: {
                primary: "outline-primary",
                soft: "outline-soft",
                glow: "outline-glow"
            },

            // BUTTON SYSTEM
            button: {
                base: [
                    "inline-flex items-center justify-center rounded-xl font-medium cursor-pointer",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" "),
                sizes: {
                    sm: "px-3 py-1.5 text-xs",
                    md: "px-4 py-2 text-sm",
                    lg: "px-5 py-2.5 text-base",
                },

                variants: {
                    primary: [
                        "bg-[var(--btn-bg-primary)] hover:bg-[var(--btn-bg-primary-hover)]",
                        "text-[var(--btn-text-primary)]",
                        "border border-[var(--btn-border-primary)]",
                        "shadow-[var(--btn-shadow)]",
                    ].join(" "),

                    // Transparent, soft border
                    ghost: [
                        "bg-transparent",
                        "border border-[var(--btn-border-soft)]",
                        "text-[var(--text-main)]",
                        "hover:bg-[var(--bg-soft)]",
                    ].join(" "),

                    // Soft panel-style button
                    subtle: [
                        "bg-[var(--bg-soft)]",
                        "border border-[var(--btn-border-soft)]",
                        "text-[var(--text-main)]",
                        "hover:bg-[var(--bg-soft)]/80",
                    ].join(" "),
                    landing: [
                        "relative inline-flex items-center justify-center overflow-hidden",
                        "cursor-pointer group",
                        "text-[var(--text-main)] bg-transparent",
                        "border border-transparent",

                        // gradient ring
                        "before:content-[''] before:absolute before:inset-0 before:rounded-xl",
                        "before:p-[2px] before:bg-[image:var(--btn-gradient-border)] before:opacity-90 before:-z-20",

                        // inner background
                        "after:content-[''] after:absolute after:inset-[2px] after:rounded-[0.70rem]",
                        "after:bg-[var(--bg-panel)] after:-z-10",

                        "transition-all duration-300 hover:before:opacity-100 hover:shadow-[var(--btn-shadow)]",
                    ].join(" "),
                    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/30",
                },
            },

            //

            stats: {
                panel: [
                    "rounded-xl border p-4",
                    "bg-[var(--bg-soft)] border-[var(--angel-border-soft)]",
                    "shadow-[var(--angel-shadow-strong)]",
                    "flex flex-col gap-1"
                ].join(" "),
                label: "text-[0.85rem] opacity-80",
                value: "text-[1.6rem] font-semibold",
                hint: "text-[0.75rem] opacity-70",
            },


            //IMAGE LAYOUTS

            landingLogo: {
                sizes: {
                    sm: "h-32 w-32 sm:h-36 sm:w-36",
                    md: "h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48",
                    lg: "h-48 w-48 sm:h-52 sm:w-52 md:h-56 md:w-56",
                },

                wrapper: "relative inline-flex items-center justify-center",

                auraColor: [
                    "absolute -inset-6 rounded-full",
                    "bg-[radial-gradient(circle_at_center,var(--accent-soft)_0%,#ff9ad5_40%,#ffd27f_70%,transparent_80%)]",
                    "blur-3xl opacity-60",
                    "animate-[angel-pulse_6s_ease-in-out_infinite]",
                ].join(" "),

                auraWhite: [
                    "absolute -inset-3 rounded-full",
                    "bg-white/40 blur-2xl opacity-40",
                    "animate-[angel-pulse_4s_ease-in-out_infinite]",
                ].join(" "),

                avatarContainer: [
                    "relative overflow-hidden",
                    "rounded-full border border-[var(--accent-soft)]",
                    "bg-[var(--bg-panel)]",
                    "shadow-[0_18px_45px_rgba(15,23,42,0.9)]",
                    "flex items-center justify-center",
                ].join(" "),
            },

            // LAYOUT BLOCKS
            layout: {
                // generic page (Login, Verify, etc.)
                page: "min-h-screen text-[var(--text-main)]",

                card: "relative overflow-hidden text-center min-w-[340px] px-10 py-10",

                // full dashboard shell: sidebar + main column
                dashboardShell: [
                    "h-screen w-full flex",
                    "text-[var(--text-main)]",
                    "overflow-hidden"
                ].join(" "),

                // right side column (navbar + scroll area)
                dashboardMain: [
                    "flex flex-1 flex-col",
                    "h-screen overflow-hidden"  // only inner content scrolls
                ].join(" "),

                // scrollable content
                dashboardContent: [
                    "flex-1 overflow-y-auto",
                    "px-6 py-6 md:px-10 md:py-8"
                ].join(" "),
            },


            // DASHBOARD PARTS
            navbar: {
                container: [
                    "flex items-center justify-between px-6 py-3 border-b",
                    "bg-[var(--bg-panel)] border-[var(--angel-border-soft)]",
                    "backdrop-blur-md",
                ].join(" "),
                title: "text-lg font-semibold text-[var(--text-main)]",
                subtitle: "text-xs text-slate-400",
            },

            sidebar: {
                container: [
                    "flex flex-col h-screen border-r",
                    "bg-[var(--bg-panel)] border-[var(--angel-border-soft)]",
                ].join(" "),
                bannerOverlay: isDark
                    ? "bg-[rgba(0,0,0,0.45)]"
                    : "bg-[rgba(255,240,247,0.14)]",
                itemBase:
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer",
                itemActive:
                    "bg-[var(--bg-soft)] text-[var(--text-main)]",
                itemInactive:
                    "text-[var(--text-main)] hover:bg-[var(--bg-soft)]/70",
                footer:
                    "flex items-center justify-between px-3 py-2 mt-auto border-t border-[var(--angel-border-soft)]",
                avatarGlow:
                    "relative rounded-full p-[3px] shadow-[0_0_18px_rgba(143,213,255,0.65)] animate-[angel-gradient_8s_ease-in-out_infinite]",
                avatarImage:
                    "h-14 w-14 rounded-full object-cover border border-[rgba(255,255,255,0.4)] shadow-[0_0_16px_rgba(143,213,255,0.5)]",
                collapsedBtn:
                    "inline-flex items-center justify-center h-9 w-9 rounded-full bg-[var(--bg-soft)] border border-[var(--btn-border-soft)] text-[var(--accent-soft)] shadow-[0_0_12px_rgba(135,206,255,0.4)] transition hover:border-[var(--btn-border-primary)] hover:shadow-[0_0_18px_var(--accent-soft)] cursor-pointer",
            },

            //SEARCH BLOCKS

            search: {
                container: [
                    "w-full",
                    "flex flex-col gap-3",
                    "sm:flex-row sm:items-center"
                ].join(" "),

                searchWrapper: [
                    "w-full",
                    "sm:basis-2/3"
                ].join(" "),

                selectWrapper: [
                    "w-full",
                    "sm:basis-1/3"
                ].join(" "),

                input: [
                    "w-full",
                    "rounded-lg border",
                    "bg-[var(--bg-panel)]",
                    "border-[var(--btn-border-soft)]",
                    "px-3 py-2",
                    "text-sm text-[var(--text-main)]",
                    "placeholder:text-slate-400",
                    "focus:outline-none",
                    "focus:border-[var(--btn-border-primary)]",
                    "focus:shadow-[0_0_8px_rgba(135,206,255,0.3)]"
                ].join(" "),

                select: [
                    "w-full",
                    "rounded-lg border",
                    "bg-[var(--bg-panel)]",
                    "border-[var(--btn-border-soft)]",
                    "px-3 py-2",
                    "text-sm text-[var(--text-main)]",
                    "focus:outline-none",
                    "focus:border-[var(--btn-border-primary)]",
                    "focus:shadow-[0_0_8px_rgba(135,206,255,0.3)]"
                ].join(" "),
            },


            // LANDING PAGE PIECES
            landing: {
                heroWrapper:
                    "min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden",
                glowOrb:
                    "pointer-events-none absolute rounded-full blur-3xl opacity-60 mix-blend-screen",
            },

            // ANIMATIONS (classes rely on tailwind.config.js)
            anim: {
                float: "animate-float",
                pulseSoft: "animate-pulse-soft",
                gradientX: "animate-gradient-x",
                spinSlow: "animate-spin-slow",
            },

            // COMMANDS
            commands: {
                // Outer gradient frame
                cardOuter: [
                    "group relative rounded-2xl p-px transition",
                    "[background:linear-gradient(135deg,rgba(143,213,255,0.82),rgba(143,213,255,0.05),rgba(143,213,255,0.12))]"
                ].join(" "),

                // Inner panel
                cardInner: [
                    "relative z-10",
                    "rounded-2xl",
                    "border border-[rgba(255,255,255,0.05)]",
                    "p-4",
                    "transition-all",
                    "overflow-hidden",
                    "group-hover:-translate-y-1.5",
                    "bg-(--bg-panel)",
                ].join(" "),

                // Shine sweep
                shine: [
                    "pointer-events-none",
                    "absolute inset-0",
                    "opacity-0 group-hover:opacity-100",
                    "-translate-x-[120%] group-hover:translate-x-[120%]",
                    "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                    "transition-all duration-900"
                ].join(" "),

                // Header
                headerTitle: "m-0 text-[1.25rem] font-semibold tracking-wide",
                headerDescription: "mt-1 mb-0 text-[0.9rem] opacity-80",

                // Scope pill
                scopeBase: [
                    "self-start rounded-full px-3 py-1",
                    "text-[0.75rem] font-semibold uppercase",
                    "bg-[var(--bg-soft)]",
                    "border"
                ].join(" "),

                scopeGlobal: "text-(--anegl-guild-scope-globaltext) border-(--angel-guild-scope-globalborder)",
                scopeGuild: "text-(--anegl-guild-scope-guildtext) border-(--angel-guild-scope-guildborder)",
                scopeDefault: "text-[var(--accent-soft)] border-[var(--angel-border-soft)]",

                // Aliases / usage
                aliasesLabel: "min-w-[70px] font-semibold",
                aliasPill: [
                    "rounded-full px-3 py-1 font-semibold",
                    "bg-(--bg-soft)",
                    "border border-(--angel-border-soft)"
                ].join(" "),

                // Footer
                footerRow: "mt-3 flex items-center justify-between text-[0.8rem] opacity-90",
                usagePill: [
                    "px-3 py-1 rounded-full font-semibold",
                    "border border-(--angel-border-soft)",
                    "bg-(--bg-soft)",
                    "text-(--text-main)"
                ].join(" "),
            },

        };
    }, [theme]);

    // Helpers to build class strings for elements
    const getButton = (variant = "primary", size = "md", extra = "") => {
        const v = styles.button.variants[variant] ?? styles.button.variants.primary;
        const s = styles.button.sizes[size] ?? styles.button.sizes.md;
        return `${styles.button.base} ${v} ${s} ${extra}`.trim();
    };

    const getGradientText = (type = "title", extra = "") => {
        const base = styles.gradients[type] ?? styles.gradients.title;
        return `${base} ${extra}`.trim();
    };


    const value = {
        styles,
        getButton,
        getGradientText
    };

    return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
}

export function useStyles() {
    return useContext(StyleContext);
}
