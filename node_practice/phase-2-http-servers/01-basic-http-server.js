/**
 * Phase 2, File 01: Basic HTTP Server
 *
 * Topics covered:
 *  - Creating an HTTP server with the built-in 'http' module
 *  - The request and response objects
 *  - Setting status codes and headers
 *  - Sending responses
 *
 * Run: node 01-basic-http-server.js
 * Test: open http://localhost:3000 in your browser
 *       or run: curl http://localhost:3000
 */

const http = require("http");

const PORT = 3000;
const HOST = "localhost";

// http.createServer takes a callback that runs on EVERY incoming request
// req = request object (what the client sent)
// res = response object (what we send back)
const server = http.createServer((req, res) => {
  console.log(`Received: ${req.method} ${req.url}`);

  // Set the HTTP status code (200 = OK)
  res.statusCode = 200;

  // Set response headers
  // Content-Type tells the client what kind of data we're sending
  res.setHeader("Content-Type", "text/plain");

  // Send the response body and end the response
  res.end("Hello, World! Welcome to Node.js HTTP server.\n");
});

// Start the server — it listens for connections on the given port
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log("Press Ctrl+C to stop");
});

// ─────────────────────────────────────────────
// SENDING HTML
// ─────────────────────────────────────────────

// You can also serve HTML pages:
//
// res.setHeader("Content-Type", "text/html");
// res.end("<h1>Hello!</h1><p>This is HTML.</p>");

// ─────────────────────────────────────────────
// SENDING JSON (what APIs do)
// ─────────────────────────────────────────────

// For a JSON API response:
//
// res.setHeader("Content-Type", "application/json");
// const data = { message: "Hello", success: true };
// res.end(JSON.stringify(data));

// ─────────────────────────────────────────────
// USEFUL REQUEST PROPERTIES
// ─────────────────────────────────────────────

// req.method     — "GET", "POST", "PUT", "DELETE"
// req.url        — "/api/users?page=1"
// req.headers    — { "content-type": "application/json", ... }

// ─────────────────────────────────────────────
// HANDLING SERVER ERRORS
// ─────────────────────────────────────────────

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error("Server error:", err.message);
  }
});
