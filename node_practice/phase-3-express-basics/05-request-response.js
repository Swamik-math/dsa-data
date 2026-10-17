/**
 * Phase 3, File 05: Request and Response Objects
 *
 * Topics covered:
 *  - req object: params, query, body, headers, ip, method, path
 *  - res object: json, send, status, redirect, cookie, download
 *  - Practical patterns
 *
 * Run: node 05-request-response.js
 */

const express = require("express");
const app = express();
const PORT = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─────────────────────────────────────────────
// REQUEST OBJECT (req)
// ─────────────────────────────────────────────

// req.params  — URL parameters  e.g., /users/:id → req.params.id
// req.query   — Query string    e.g., /search?q=node → req.query.q
// req.body    — Request body    e.g., POST JSON body (requires express.json())
// req.headers — Request headers e.g., req.headers["content-type"]
// req.method  — HTTP method     e.g., "GET", "POST"
// req.path    — URL path        e.g., "/users/1"
// req.ip      — Client IP       e.g., "::1" (localhost)
// req.get(h)  — Get a header    e.g., req.get("Authorization")

app.get("/inspect/:id", (req, res) => {
  res.json({
    params: req.params,        // { id: "123" }
    query: req.query,          // { page: "1" }
    method: req.method,        // "GET"
    path: req.path,            // "/inspect/123"
    ip: req.ip,
    headers: {
      "content-type": req.get("Content-Type"),
      "user-agent": req.get("User-Agent"),
      authorization: req.get("Authorization"),
    },
  });
});

// ─────────────────────────────────────────────
// RESPONSE OBJECT (res)
// ─────────────────────────────────────────────

// res.json(data)             — send JSON
// res.send(data)             — send string/buffer/object
// res.status(code)           — set status (chainable)
// res.sendStatus(code)       — set status + default body
// res.redirect(url)          — redirect client
// res.set(header, value)     — set a header
// res.cookie(name, value)    — set a cookie
// res.clearCookie(name)      — clear a cookie
// res.download(path)         — send a file as download
// res.sendFile(path)         — send a file

// Response type examples
app.get("/response/:type", (req, res) => {
  const { type } = req.params;

  switch (type) {
    case "json":
      res.json({ message: "JSON response", success: true });
      break;

    case "text":
      res.send("Plain text response");
      break;

    case "html":
      res.send("<h1>HTML Response</h1><p>With <strong>formatting</strong></p>");
      break;

    case "status-400":
      res.status(400).json({ error: "Bad Request" });
      break;

    case "status-204":
      res.sendStatus(204);
      break;

    case "redirect":
      res.redirect("/"); // 302 by default
      break;

    case "redirect-perm":
      res.redirect(301, "/"); // 301 permanent redirect
      break;

    case "headers":
      res
        .set("X-Custom-Header", "hello")
        .set("X-API-Version", "1.0")
        .json({ message: "Check the response headers!" });
      break;

    default:
      res.status(404).json({ error: `Unknown type: ${type}` });
  }
});

// ─────────────────────────────────────────────
// PRACTICAL: Pagination helper
// ─────────────────────────────────────────────

const allItems = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

app.get("/items", (req, res) => {
  // Parse pagination params with defaults and limits
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const data = allItems.slice(skip, skip + limit);
  const total = allItems.length;
  const totalPages = Math.ceil(total / limit);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
});

// ─────────────────────────────────────────────
// PRACTICAL: Consistent API response format
// ─────────────────────────────────────────────

// A common pattern: always respond with the same structure
function successResponse(res, data, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

function errorResponse(res, message, statusCode = 400) {
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}

app.get("/formatted/user/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return errorResponse(res, "Invalid user ID", 400);
  }

  if (id > 100) {
    return errorResponse(res, "User not found", 404);
  }

  const user = { id, name: "Alice", email: "alice@example.com" };
  successResponse(res, user);
});

// ─────────────────────────────────────────────
// ROOT — list all demo routes
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    routes: [
      "GET /inspect/123?page=1  — Inspect request object",
      "GET /response/json        — JSON response",
      "GET /response/text        — Text response",
      "GET /response/status-400  — Error response",
      "GET /response/redirect    — Redirect",
      "GET /response/headers     — Custom headers",
      "GET /items                — Paginated list",
      "GET /items?page=2&limit=5 — Paginated with params",
      "GET /formatted/user/1     — Consistent response format",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Request/Response demo at http://localhost:${PORT}`);
});
