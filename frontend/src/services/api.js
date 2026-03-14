const API_BASE_URL = "http://localhost:5000";

export async function loginUser(email, password) {
  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}


export async function registerUser(payload) {
  const response = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

const API_BASE = "http://localhost:5000";

export async function getCitizenStats() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API_BASE}/api/citizen/stats`, {
    headers: {
      Authorization: "Bearer " + user.token
    }
  });

  return res.json();
}

export async function submitDamage(payload) {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API_BASE}/api/submit-waste`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.token
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function getPendingSubmissions() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API_BASE}/api/pending-submissions`, {
    headers: {
      Authorization: "Bearer " + user.token
    }
  });

  return res.json();
}

export async function validateSubmission(id, action) {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(
    `http://localhost:5001/api/validate-submission/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token
      },
      body: JSON.stringify({ action })
    }
  );

  return res.json();
}

export async function raiseIssue(payload) {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch("http://localhost:5000/api/raise-issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.token
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

// ================= ADMIN =================

export async function getAdminStats() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch("http://localhost:5000/api/admin/stats", {
    headers: {
      Authorization: "Bearer " + user.token
    }
  });

  return res.json();
}

export async function getAllUsers() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch("http://localhost:5000/api/users", {
    headers: {
      Authorization: "Bearer " + user.token
    }
  });

  return res.json();
}

export async function updateUserStatus(userId, status) {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(
    `http://localhost:5000/api/user/${userId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token
      },
      body: JSON.stringify({ status })
    }
  );

  return res.json();
}

export async function getAdminIssues() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch("http://localhost:5000/api/admin/issues", {
    headers: {
      Authorization: "Bearer " + user.token
    }
  });

  return res.json();
}
