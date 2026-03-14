import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* Public pages */
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

/* Citizen pages */
import CitizenDashboard from "./pages/citizen/Dashboard";
import SubmitDamage from "./pages/citizen/SubmitDamage";

/* Sanitization pages */
import SanitizationDashboard from "./pages/sanitization/Dashboard";
import PendingSubmissions from "./pages/sanitization/PendingSubmissions";
import RaiseIssue from "./pages/sanitization/RaiseIssue";

/* Admin pages */
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Issues from "./pages/admin/Issues";

/* Route protection */
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== CITIZEN ROUTES ===== */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute role="Citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/submit"
          element={
            <ProtectedRoute role="Citizen">
              <SubmitDamage />
            </ProtectedRoute>
          }
        />

        {/* ===== SANITIZATION ROUTES ===== */}
        <Route
          path="/sanitization/dashboard"
          element={
            <ProtectedRoute role="Sanitization">
              <SanitizationDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sanitization/pending"
          element={
            <ProtectedRoute role="Sanitization">
              <PendingSubmissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sanitization/raise-issue"
          element={
            <ProtectedRoute role="Sanitization">
              <RaiseIssue />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute role="Admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute role="Admin">
              <Issues />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
