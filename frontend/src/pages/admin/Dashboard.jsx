import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats } from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    citizens: 0,
    workers: 0,
    submissions: 0,
    issues: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load admin statistics: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <main className="main-content admin-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {user?.name || "Admin"}!</h1>
        <p>You have full control over the system</p>
      </div>

      {/* Stats Section */}
      {loading ? (
        <p className="loading">Loading dashboard data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Citizens</h3>
            <h1>{stats.citizens}</h1>
            <p>1020</p>
          </div>

          <div className="stat-card">
            <h3>Sanitization Officers</h3>
            <p>120</p>
            <p>{stats.workers}</p>
          </div>

          <div className="stat-card">
            <h3>Total Submissions</h3>
            <p>1220</p>
            <p>{stats.submissions}</p>
          </div>

          <div className="stat-card">
            <h3>Open Issues</h3>
            <p>10</p>
            <p>{stats.issues}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>System Management</h2>

        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate("/admin/manage-users")}
          >
            View & Manage Users
          </button>

          <button
            className="action-btn"
            onClick={() => navigate("/admin/issues")}
          >
            View & Resolve Issues
          </button>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
