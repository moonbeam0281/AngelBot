import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
//import "./Dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <SideBar />

            <div className="dashboard-main">
                <NavBar />

                <div className="dashboard-content">
                    <h1>Welcome to the AngelBot Dashboard ✨</h1>
                    <p>More panels coming soon...</p>
                </div>
            </div>
        </div>
    );
}
