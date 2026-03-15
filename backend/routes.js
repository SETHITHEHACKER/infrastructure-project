import db from "./db.js";
import { registerUser, loginUser } from "./auth.js";

export async function handleRequest(req, res, body) {
  // ---------------- CORS ----------------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // ---------------- ROOT ROUTE ----------------
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      message: "Backend running successfully 🚀"
    }));
  }

  try {

    // =================================================
    // REGISTER
    // =================================================
    if (req.url === "/api/register" && req.method === "POST") {
      await registerUser(JSON.parse(body));
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        message: "Registration successful. Wait for admin approval."
      }));
    }

    // =================================================
    // LOGIN
    // =================================================
    if (req.url === "/api/login" && req.method === "POST") {
      const { email, password } = JSON.parse(body);
      const user = await loginUser(email, password);

      if (!user) {
        res.writeHead(401);
        return res.end(JSON.stringify({ message: "Invalid email or password" }));
      }

      if (user.status === "PENDING") {
        res.writeHead(403);
        return res.end(JSON.stringify({
          message: "Your account is pending admin approval"
        }));
      }

      if (user.status === "BLOCKED") {
        res.writeHead(403);
        return res.end(JSON.stringify({
          message: "Your account has been blocked by admin"
        }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        token: `token-${user.id}`,
        user,
        redirectTo:
          user.role === "Citizen"
            ? "/citizen/dashboard"
            : user.role === "Sanitization"
            ? "/sanitization/dashboard"
            : "/admin/dashboard"
      }));
    }

    // =================================================
    // ADMIN – GET USERS
    // =================================================
    if (req.url === "/api/users" && req.method === "GET") {
      const [users] = await db.query(`
        SELECT 
          u.id, u.name, u.email, u.phone,
          r.name AS role_name,
          u.status,
          COUNT(s.id) AS submissions_count
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN submissions s ON s.user_id = u.id
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ users }));
    }

    // =================================================
    // UPDATE USER STATUS
    // =================================================
    if (req.url.startsWith("/api/user/") && req.url.endsWith("/status") && req.method === "PUT") {
      const userId = req.url.split("/")[3];
      const { status } = JSON.parse(body);

      await db.query(
        "UPDATE users SET status = ? WHERE id = ?",
        [status, userId]
      );

      res.writeHead(200);
      return res.end(JSON.stringify({ message: "User status updated" }));
    }

    // =================================================
    // ADMIN – VIEW ISSUES
    // =================================================
    if (req.url === "/api/admin/issues" && req.method === "GET") {
      const [issues] = await db.query(`
        SELECT 
          i.id, i.title, i.description, i.status, i.created_at,
          u.name AS workerName
        FROM issues i
        JOIN users u ON i.worker_id = u.id
        ORDER BY i.created_at DESC
      `);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ issues }));
    }

    // =================================================
    // PENDING SUBMISSIONS
    // =================================================
    if (req.url === "/api/pending-submissions" && req.method === "GET") {
      const [submissions] = await db.query(`
        SELECT 
          s.id, s.wasteType, s.address, s.submitted_at,
          u.name AS citizenName
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.status = 'PENDING'
        ORDER BY s.submitted_at DESC
      `);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ submissions }));
    }

    // =================================================
    // UPDATE SUBMISSION STATUS
    // =================================================
    if (req.url.startsWith("/api/validate-submission/") && req.method === "POST") {
      const id = req.url.split("/")[3];
      const { action } = JSON.parse(body);

      const statusMap = {
        ACCEPT: "ACCEPTED",
        WORK_DONE: "WORK_DONE",
        REJECT: "REJECTED"
      };

      await db.query(
        "UPDATE submissions SET status = ? WHERE id = ?",
        [statusMap[action], id]
      );

      res.writeHead(200);
      return res.end(JSON.stringify({ message: "Submission updated" }));
    }

    // =================================================
    // RAISE ISSUE
    // =================================================
    if (req.url === "/api/raise-issue" && req.method === "POST") {
      const { title, description } = JSON.parse(body);

      await db.query(
        "INSERT INTO issues (worker_id, title, description) VALUES (3, ?, ?)",
        [title, description]
      );

      res.writeHead(201);
      return res.end(JSON.stringify({ message: "Issue submitted" }));
    }

    // =================================================
    // CITIZEN STATS
    // =================================================
    if (req.url === "/api/citizen/stats" && req.method === "GET") {
      const [[stats]] = await db.query(`
        SELECT
          COUNT(*) AS totalSubmissions,
          SUM(status='ACCEPTED') AS approved,
          SUM(status='PENDING') AS pending
        FROM submissions
      `);

      res.writeHead(200);
      return res.end(JSON.stringify(stats));
    }

    // =================================================
    // SUBMIT WASTE
    // =================================================
    if (req.url === "/api/submit-waste" && req.method === "POST") {
      const { wasteType, address } = JSON.parse(body);

      await db.query(
        "INSERT INTO submissions (user_id, wasteType, address) VALUES (2, ?, ?)",
        [wasteType, address]
      );

      res.writeHead(201);
      return res.end(JSON.stringify({
        message: "Submission sent for validation",
        pointsPossible: 10
      }));
    }

    // =================================================
    // FALLBACK
    // =================================================
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));

  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Server error" }));
  }
}
