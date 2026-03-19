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

  // ---------------- ROOT ----------------
  if (req.url === "/" && req.method === "GET") {
    return res.end(JSON.stringify({ message: "Backend running 🚀" }));
  }

  try {

    // ================= REGISTER =================
    if (req.url === "/api/register" && req.method === "POST") {
      await registerUser(JSON.parse(body));
      return res.end(JSON.stringify({ message: "Registered successfully" }));
    }

    // ================= LOGIN =================
    if (req.url === "/api/login" && req.method === "POST") {
      const { email, password } = JSON.parse(body);
      const user = await loginUser(email, password);

      if (user.status === "PENDING") {
        return res.end(JSON.stringify({ message: "Pending approval" }));
      }

      return res.end(JSON.stringify({
        user,
        token: `token-${user.id}`
      }));
    }

    // ================= GET USERS (FIXED 🔥) =================
    if (req.url === "/api/users" && req.method === "GET") {
      const result = await db.query(`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.phone,
          r.name AS role_name,
          u.status,
          COUNT(s.id) AS submissions_count
        FROM users u
        JOIN roles r ON u.role_id = r.id
        LEFT JOIN submissions s ON s.user_id = u.id
        GROUP BY 
          u.id, u.name, u.email, u.phone, r.name, u.status
        ORDER BY u.id DESC
      `);

      return res.end(JSON.stringify({ users: result.rows }));
    }

    // ================= UPDATE USER STATUS =================
    if (req.url.startsWith("/api/user/") && req.method === "PUT") {
      const id = req.url.split("/")[3];
      const { status } = JSON.parse(body);

      await db.query(
        "UPDATE users SET status = $1 WHERE id = $2",
        [status, id]
      );

      return res.end(JSON.stringify({ message: "Updated" }));
    }

    // ================= ISSUES =================
    if (req.url === "/api/admin/issues" && req.method === "GET") {
      const result = await db.query(`
        SELECT 
          i.id, i.title, i.description, i.status,
          u.name AS worker
        FROM issues i
        JOIN users u ON i.worker_id = u.id
      `);

      return res.end(JSON.stringify({ issues: result.rows }));
    }

    // ================= SUBMISSIONS =================
    if (req.url === "/api/pending-submissions" && req.method === "GET") {
      const result = await db.query(`
        SELECT 
          s.id, s.wasteType, s.address,
          u.name AS citizen
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.status = 'PENDING'
      `);

      return res.end(JSON.stringify({ submissions: result.rows }));
    }

    // ================= UPDATE SUBMISSION =================
    if (req.url.startsWith("/api/validate-submission/")) {
      const id = req.url.split("/")[3];
      const { action } = JSON.parse(body);

      const map = {
        ACCEPT: "ACCEPTED",
        WORK_DONE: "WORK_DONE",
        REJECT: "REJECTED"
      };

      await db.query(
        "UPDATE submissions SET status = $1 WHERE id = $2",
        [map[action], id]
      );

      return res.end(JSON.stringify({ message: "Updated" }));
    }

    // ================= RAISE ISSUE =================
    if (req.url === "/api/raise-issue" && req.method === "POST") {
      const { title, description } = JSON.parse(body);

      await db.query(
        "INSERT INTO issues (worker_id, title, description) VALUES ($1,$2,$3)",
        [1, title, description]
      );

      return res.end(JSON.stringify({ message: "Issue added" }));
    }

    // ================= SUBMIT WASTE =================
    if (req.url === "/api/submit-waste" && req.method === "POST") {
      const { wasteType, address } = JSON.parse(body);

      await db.query(
        "INSERT INTO submissions (user_id, wasteType, address) VALUES ($1,$2,$3)",
        [2, wasteType, address]
      );

      return res.end(JSON.stringify({ message: "Submitted" }));
    }

    // ================= FALLBACK =================
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Not found" }));

  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ message: err.message }));
  }
}
