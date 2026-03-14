import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * @param {ReactNode} children
 * @param {string} role - required role (Citizen | Sanitization | Admin)
 */
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  // Not logged in
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    // Redirect user to their own dashboard
    if (user.role === "Citizen") {
      return <Navigate to="/citizen/dashboard" replace />;
    }
    if (user.role === "Sanitization") {
      return <Navigate to="/sanitization/dashboard" replace />;
    }
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // fallback
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
}

export default ProtectedRoute;
