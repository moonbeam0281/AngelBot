import { Link } from "react-router-dom";
import { useStyles } from "../context/StyleContext.jsx";

export default function NotFound() {
    const { styles, getButton, getGradientText } = useStyles();

    return (
        <div className={`${styles.layout.page} flex items-center justify-center relative`}>
            <div className={`${styles.layout.card}`}>
                {/* Title */}
                <h1 className={getGradientText("soft", "text-2xl mb-2")}>
                    404 – Not Found
                </h1>

                {/* Description */}
                <p className={`${styles.text.base} opacity-85 mb-6 text-[0.95rem]`}>
                    The page you’re looking for doesn’t exist.
                </p>

                {/* Back home button */}
                <Link to="/" className={getButton("primary", "md", "w-full flex items-center justify-center no-underline")}>
                    Go back home
                </Link>
            </div>
        </div>
    );
}
