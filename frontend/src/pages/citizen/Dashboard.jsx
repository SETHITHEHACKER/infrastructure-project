import { useEffect, useState } from "react";
import { getCitizenStats } from "../../services/api";
import "../../styles/citizen.css";


function CitizenDashboard() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    approved: 0,
    pending: 0
  });

  useEffect(() => {
    getCitizenStats().then(setStats);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="main-content citizen-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Thank you for helping keep our city clean</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Submissions</h3>
          <p>{stats.totalSubmissions}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
      </div>
    </main>
  );
}

export default CitizenDashboard;