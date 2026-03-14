import { useEffect, useState } from "react";
import { getAdminIssues } from "../../services/api";
import "../../styles/admin.css";

function Issues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getAdminIssues();
      setIssues(data.issues || []);
    }
    load();
  }, []);

  return (
    <main className="main-content admin-container">
      <div className="welcome-section">
        <h1>Worker Reports & Issues</h1>
        <p>Manage concerns raised by Sanitization Workers</p>
      </div>

      <div className="issues-grid">
        {issues.length === 0 && (
          <p className="no-issues">No reports available</p>
        )}

        {issues.map(i => (
          <div key={i.id} className="issue-card">
            <h3>{i.title}</h3>
            <p><strong>Worker:</strong> {i.workerName}</p>
            <p>{i.description}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${i.status.toLowerCase()}`}>
                {i.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Issues;
