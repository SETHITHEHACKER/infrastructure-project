import "../../styles/sanitization.css";


function SanitizationDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="main-content sanitization-container">
      <div className="welcome-section">
        <h1>Welcome, {user?.name}!</h1>
        <p>Thank you for validating infrastructure damage reports</p>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/sanitization/pending" className="action-btn">
            Review Pending Submissions
          </a>
          <a href="/sanitization/raise-issue" className="action-btn red">
            Raise Issue to Admin
          </a>
        </div>
      </div>
    </main>
  );
}

export default SanitizationDashboard;
