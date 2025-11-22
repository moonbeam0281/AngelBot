import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
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
import DashboardItems from "./components/DashboardItems.jsx"

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) return <div className="app-loading">Loading...</div>;
  if (!isAuth) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BotInfoProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join/verify" element={<Verify />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}>
            <Route index element={<DashboardItems />} />
            <Route path="guilds" element={<Guilds />} />
            <Route path="commands" element={<Commands />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route to="*" element={<NotFound />} />
        </Routes>
      </BotInfoProvider>
    </AuthProvider>
  );
}
