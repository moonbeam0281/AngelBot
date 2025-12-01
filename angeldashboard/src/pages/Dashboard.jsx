import { Outlet } from "react-router-dom";
import SideBar from "../components/dashboard/SideBar.jsx";
import NavBar from "../components/dashboard/NavBar.jsx";
import { useStyles } from "../context/StyleContext.jsx";

export default function Dashboard() {
    const { styles } = useStyles();

    return (
        <div className={styles.layout.dashboardShell}>
            <SideBar />

            <div className={styles.layout.dashboardMain}>
                <NavBar />

                <div className={styles.layout.dashboardContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
