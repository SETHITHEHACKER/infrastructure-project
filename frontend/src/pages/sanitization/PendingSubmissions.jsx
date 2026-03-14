import { useEffect, useState, useCallback } from "react";

const API_BASE = "http://localhost:5000";

function PendingSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Load pending submissions
  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/pending-submissions`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch submissions");
      }

      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to load pending submissions");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Update submission status
  const updateStatus = async (id, action) => {
    if (!window.confirm(`Confirm action: ${action.replace("_", " ")}?`)) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/validate-submission/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        loadSubmissions(); // refresh list
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update submission");
    }
  };

  return (
    <main className="main-content sanitization-container">
      <div className="welcome-section">
        <h1>Pending Damage Submissions</h1>
        <p>Review citizen submissions and validate repairs</p>
      </div>

      <div className="submissions-grid">
        {loading && <p>Loading submissions...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && submissions.length === 0 && (
          <p className="no-submissions">
            No pending reports at this time.
          </p>
        )}

        {!loading &&
          submissions.map((sub) => (
            <div key={sub.id} className="submission-card">
              <div className="submission-info">
                <p><strong>Citizen:</strong> {sub.citizenName}</p>
                <p><strong>Type:</strong> {sub.wasteType}</p>
                <p>
                  <strong>Location:</strong>{" "}
                  <span style={{ color: "#e67e22" }}>{sub.address}</span>
                </p>
                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(sub.submitted_at).toLocaleString()}
                </p>
              </div>

              <div className="submission-actions">


                <button
                  className="action-btn"
                  onClick={() => updateStatus(sub.id, "WORK_DONE")}
                >
                  Work Done
                </button>

                <button
                  className="action-btn reject"
                  onClick={() => updateStatus(sub.id, "REJECT")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default PendingSubmissions;