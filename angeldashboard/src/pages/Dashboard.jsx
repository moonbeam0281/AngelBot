import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <SideBar />

            <div className="dashboard-main">
                <NavBar />

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
