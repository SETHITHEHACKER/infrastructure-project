import http from "http";
import { handleRequest } from "./routes.js";
import db from "./db.js";

// Render automatically PORT provide karta hai, 10000 uska default hai
const PORT = process.env.PORT || 10000; 

async function startServer() {
  try {
    // Check database connection before starting server
    await db.query("SELECT 1");
    console.log("✅ Database connected successfully");

    const server = http.createServer((req, res) => {
      // ✅ CORS headers (Sahi tareeke se set kiye gaye hain)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // ✅ Handle Preflight (OPTIONS) request - Render/Production ke liye zaroori hai
      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      let chunks = [];

      // Data chunks collect karna (Buffer use karna safe hota hai)
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", async () => {
        try {
          const body = Buffer.concat(chunks).toString();
          
          // Request handle karne ke liye routes.js ko bhej rahe hain
          await handleRequest(req, res, body);
          
        } catch (err) {
          console.error("❌ Request handling error:", err.message);
          
          // Agar response abhi tak end nahi hua hai toh error bhejein
          if (!res.writableEnded) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              error: "Internal server error",
              message: err.message
            }));
          }
        }
      });

      // Connection errors handle karna
      req.on("error", (err) => {
        console.error("Server Request Error:", err);
        res.statusCode = 400;
        res.end();
      });
    });

    // ✅ FIXED: '0.0.0.0' add kiya gaya hai taaki Render ise public network par sun sake
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend running on port ${PORT}`);
      console.log(`🌍 Public Access Enabled at 0.0.0.0`);
    });

  } catch (err) {
    // Agar Database connect nahi hua toh server start nahi hoga
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error("Reason:", err.message);
    process.exit(1);
  }
}

startServer();
