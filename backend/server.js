import http from "http";
import { handleRequest } from "./routes.js";
import db from "./db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connected successfully");

    const server = http.createServer((req, res) => {
      // CORS Headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204); // 204 No Content preflight ke liye better hai
        res.end();
        return;
      }

      // ✅ Better way to handle body using Buffers
      let chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));

      req.on("end", async () => {
        try {
          const completeBody = Buffer.concat(chunks).toString();
          // handleRequest ko call karein
          await handleRequest(req, res, completeBody);
        } catch (err) {
          console.error("❌ Request handling error:", err.message);
          if (!res.writableEnded) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
          }
        }
      });

      // Handle stream errors
      req.on("error", (err) => {
        console.error("Stream Error:", err);
        res.statusCode = 400;
        res.end();
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    process.exit(1);
  }
}

startServer();
