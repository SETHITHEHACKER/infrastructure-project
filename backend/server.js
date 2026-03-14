import http from "http";
import { handleRequest } from "./routes.js";
import db from "./db.js";

const PORT = 5000;

/**
 * Check database connection before starting server
 */
async function startServer() {
  try {
    // Test DB connection
    await db.query("SELECT 1");
    console.log("✅ Database connected successfully");

    // Create server ONLY if DB is connected
    const server = http.createServer((req, res) => {
      let body = "";

      req.on("data", chunk => body += chunk);
      req.on("end", async () => {
        try {
          await handleRequest(req, res, body);
        } catch (err) {
          console.error("❌ Request handling error:", err.message);

          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: "Internal server error",
            message: err.message
          }));
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });

  } catch (err) {
    // DB connection failed
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error("Reason:", err.message);
    console.error("👉 Server NOT started");

    process.exit(1); // Stop the app
  }
}

startServer();
