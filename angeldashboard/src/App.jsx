import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import { BotInfoProvider } from "./context/BotInfoContext.jsx";
import Verify from "./pages/Verify.jsx";
import Guilds from "./components/dashboard/Guilds.jsx";
import Commands from "./components/dashboard/Commands.jsx";
import Settings from "./components/dashboard/Settings.jsx";
import DashboardHome from "./components/dashboard/DashboardHome.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { StyleProvider } from "./context/StyleContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-(--bg-main) text-(--text-main)
        "
      >
        <div
          className="
            h-10 w-10 rounded-full
            border-2 border-(--accent) border-t-transparent
            animate-spin
          "
        />
      </div>
    );
  }

  if (!isAuth) return <Navigate to="/" replace />;

  return children;
}


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StyleProvider>
          <BotInfoProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join/verify" element={<Verify />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="guilds" element={<Guilds />} />
                <Route path="commands" element={<Commands />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BotInfoProvider>
        </StyleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
