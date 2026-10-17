/**
 * Phase 2, File 05: Headers
 *
 * Topics covered:
 *  - What are HTTP headers?
 *  - Reading request headers
 *  - Setting response headers
 *  - Common headers (Content-Type, Authorization, CORS, Cache-Control)
 *  - Custom headers
 *
 * Run: node 05-headers.js
 * Test: curl -i -H "Authorization: Bearer mytoken123" http://localhost:3004/protected
 */

const http = require("http");

const PORT = 3004;

function sendJSON(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────────
// COMMON RESPONSE HEADERS
// ─────────────────────────────────────────────

// Content-Type     — what type of data you're sending
// Content-Length   — size of the response in bytes
// Location         — where to redirect
// Cache-Control    — caching instructions for browsers/proxies
// Access-Control-Allow-Origin — CORS header for browser requests
// X-Request-Id     — custom header to track requests (convention: start with X-)

// ─────────────────────────────────────────────
// COMMON REQUEST HEADERS
// ─────────────────────────────────────────────

// Content-Type     — type of data in the request body
// Authorization    — credentials (e.g., "Bearer <token>")
// Accept           — what types of response the client can handle
// User-Agent       — browser/client software info
// Cookie           — session cookies

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;

  // ── Show all request headers ───────────────
  if (url === "/headers") {
    console.log("Request headers:", headers);
    sendJSON(res, 200, {
      message: "Your request headers",
      headers,
    });
    return;
  }

  // ── Protected route (check Authorization header) ──
  if (url === "/protected") {
    const authHeader = headers["authorization"];

    if (!authHeader) {
      res.setHeader("WWW-Authenticate", "Bearer realm=\"myapp\"");
      sendJSON(res, 401, { error: "Authorization header is required" });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      sendJSON(res, 401, { error: "Authorization must be a Bearer token" });
      return;
    }

    const token = authHeader.slice(7); // remove "Bearer " prefix

    // In a real app you'd verify the token
    if (token !== "mytoken123") {
      sendJSON(res, 403, { error: "Invalid token" });
      return;
    }

    sendJSON(res, 200, { message: "Welcome! You are authorized.", token });
    return;
  }

  // ── CORS headers demo ──────────────────────
  // CORS = Cross-Origin Resource Sharing
  // When a browser on domain A calls an API on domain B, CORS headers control access.
  if (url === "/cors-demo") {
    // Allow any domain to access this endpoint (for development)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (method === "OPTIONS") {
      // Preflight request — browser checks CORS before the real request
      res.statusCode = 204;
      res.end();
      return;
    }

    sendJSON(res, 200, { message: "CORS headers are set!", method });
    return;
  }

  // ── Cache headers demo ─────────────────────
  if (url === "/cached") {
    // Tell the browser to cache this response for 5 minutes
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("ETag", '"abc123"');  // entity tag for cache validation
    sendJSON(res, 200, {
      message: "This response can be cached for 5 minutes",
      generatedAt: new Date().toISOString(),
    });
    return;
  }

  // ── Content-Type examples ──────────────────
  if (url === "/json") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ type: "JSON response" }));
    return;
  }

  if (url === "/html") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>HTML Response</h1><p>This is an HTML page.</p>");
    return;
  }

  if (url === "/text") {
    res.setHeader("Content-Type", "text/plain");
    res.end("Plain text response");
    return;
  }

  // ── Custom headers ─────────────────────────
  if (url === "/custom-headers") {
    res.setHeader("X-Request-Id", `req-${Date.now()}`);
    res.setHeader("X-Response-Time", "42ms");
    res.setHeader("X-API-Version", "1.0");
    sendJSON(res, 200, { message: "Check response headers with curl -i" });
    return;
  }

  // ── Default ────────────────────────────────
  sendJSON(res, 200, {
    routes: [
      "GET /headers          — See all your request headers",
      "GET /protected        — Requires Authorization: Bearer mytoken123",
      "GET /cors-demo        — CORS headers example",
      "GET /cached           — Cache-Control headers example",
      "GET /json             — JSON content type",
      "GET /html             — HTML content type",
      "GET /text             — Plain text content type",
      "GET /custom-headers   — Custom X- headers",
    ],
  });
});

server.listen(PORT, () => {
  console.log(`Headers demo running at http://localhost:${PORT}`);
  console.log("\nTry these:");
  console.log(`  curl http://localhost:${PORT}/headers`);
  console.log(`  curl -i http://localhost:${PORT}/protected`);
  console.log(`  curl -i -H "Authorization: Bearer mytoken123" http://localhost:${PORT}/protected`);
  console.log(`  curl -i http://localhost:${PORT}/custom-headers`);
});
