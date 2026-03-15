// ================= BASE URL =================

const API_BASE_URL = "https://infrastructure-project-2.onrender.com";

// ================= AUTH =================

// Login
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // save user in localStorage
  localStorage.setItem("user", JSON.stringify(data));

  return data;
}


// Register
export async function registerUser(payload) {
  const res = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}


// Logout
export function logoutUser() {
  localStorage.removeItem("user");
}


// ================= TOKEN HELPER =================

function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
}


// ================= CITIZEN =================


// Citizen Dashboard Stats
export async function getCitizenStats() {
  const res = await fetch(`${API_BASE_URL}/api/citizen/stats`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  return res.json();
}


// Submit Damage / Waste Report
export async function submitDamage(payload) {
  const res = await fetch(`${API_BASE_URL}/api/submit-waste`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}


// Get Pending Submissions
export async function getPendingSubmissions() {
  const res = await fetch(`${API_BASE_URL}/api/pending-submissions`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  return res.json();
}


// Validate Submission
export async function validateSubmission(id, action) {
  const res = await fetch(
    `${API_BASE_URL}/api/validate-submission/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({ action })
    }
  );

  return res.json();
}


// Raise New Issue
export async function raiseIssue(payload) {
  const res = await fetch(`${API_BASE_URL}/api/raise-issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}


// ================= ADMIN =================


// Admin Dashboard Stats
export async function getAdminStats() {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  return res.json();
}


// Get All Users
export async function getAllUsers() {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  return res.json();
}


// Update User Status
export async function updateUserStatus(userId, status) {
  const res = await fetch(
    `${API_BASE_URL}/api/user/${userId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({ status })
    }
  );

  return res.json();
}


// Get All Issues (Admin)
export async function getAdminIssues() {
  const res = await fetch(`${API_BASE_URL}/api/admin/issues`, {
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  return res.json();
}
