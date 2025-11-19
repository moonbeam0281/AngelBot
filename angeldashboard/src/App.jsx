import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
