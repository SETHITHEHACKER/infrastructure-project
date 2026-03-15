import { useEffect, useState, useCallback } from "react";

const API_BASE = "https://infrastructure-project-2.onrender.com";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Wrapped in useCallback to fix ESLint warning
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err) {
      setError("Network error while loading users");
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  }, [token]);


  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const actionText = newStatus === "ACTIVE" ? "activate" : "block";

    if (!window.confirm(`Are you sure you want to ${actionText} ${user.name}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/user/${user.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || `User ${actionText}d successfully`);
        loadUsers();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Network error - please try again");
      console.error("Error updating user status", err);
    }
  };

  return (
    <main className="main-content admin-container">
      <div className="welcome-section">
        <h1>Manage Users</h1>
        <p>
          View and control all user accounts. New users are PENDING until
          activated.
        </p>
      </div>

      <div className="users-table-container">
        {loading && (
          <p className="loading">Loading users... Please wait.</p>
        )}

        {error && <p className="error">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && users.length > 0 && (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td>{u.role_name}</td>
                  <td>{u.submissions_count || 0}</td>
                  <td>
                    <span
                      className={`status-badge ${u.status.toLowerCase()}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`action-btn small ${
                        u.status === "ACTIVE" ? "reject" : "approve"
                      }`}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.status === "ACTIVE"
                        ? "Block"
                        : u.status === "PENDING"
                        ? "Activate"
                        : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default ManageUsers;
