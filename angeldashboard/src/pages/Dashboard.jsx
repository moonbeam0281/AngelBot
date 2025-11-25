import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

export default function Dashboard() {
    return (
        <div
            className="
                flex min-h-screen w-full
                bg-(--bg-main)
                text-(--text-main)
            "
        >
            <SideBar />

            <div className="flex flex-1 flex-col">
                <NavBar />

                <div
                    className="
                        flex-1
                        px-6 py-6
                        md:px-10 md:py-8
                    "
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
