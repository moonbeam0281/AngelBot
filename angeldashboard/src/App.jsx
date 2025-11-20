import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) return <div className="app-loading">Loading...</div>;
  if (!isAuth) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route to="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
