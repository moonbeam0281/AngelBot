import { useStyles } from "../../context/StyleContext.jsx";

export default function AuthLoadingScreen({
    message = "Checking session...",
    title = "Angel Dashboard",
}) {
    const { styles, getGradientText } = useStyles();

    return (
        <div className={`${styles.layout.page} flex items-center justify-center`}>
            <div className={`${styles.layout.card} w-[340px] text-center`}>
                <h1 className={getGradientText("title", "text-3xl mb-2")}>
                    {title}
                </h1>
                <p className="opacity-80 text-sm">{message}</p>
            </div>
        </div>
    );
}
