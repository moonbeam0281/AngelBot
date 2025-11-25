import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            className="
                min-h-screen flex items-center justify-center
                bg-[radial-gradient(circle_at_top,#1b2238,#050716_60%,#02030a)]
                text-(--text-main)
                relative
            "
        >
            <div
                className="
                    relative overflow-hidden text-center
                    min-w-[340px]
                    rounded-2xl
                    border border-[rgba(135,206,255,0.35)]
                    bg-[rgba(12,18,34,0.88)]
                    shadow-[0_0_30px_rgba(135,206,255,0.25)]
                    px-10 py-10
                "
            >
                <h1 className="text-2xl text-(--accent) mb-2">404 – Not Found</h1>

                <p className="opacity-85 mb-6 text-[0.95rem]">
                    The page you’re looking for doesn’t exist.
                </p>

                <Link
                    to="/"
                    className="
                        inline-flex items-center justify-center
                        w-full
                        rounded-xl
                        bg-linear-to-r from-sky-300 to-purple-300
                        px-4 py-3
                        font-semibold text-slate-900 text-[1rem]
                        shadow-[0_0_10px_rgba(135,206,255,0.3)]
                        transition
                        hover:brightness-110 hover:shadow-[0_0_16px_rgba(135,206,255,0.45)]
                        no-underline
                    "
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
