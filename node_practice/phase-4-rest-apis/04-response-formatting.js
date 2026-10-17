/**
 * Phase 4, File 04: Response Formatting
 *
 * Topics covered:
 *  - Consistent API response structure
 *  - Envelope pattern
 *  - Error response format
 *  - Pagination metadata
 *  - API response helpers
 *
 * Run: node 04-response-formatting.js
 */

const express = require("express");
const app = express();
const PORT = 3003;

app.use(express.json());

// ─────────────────────────────────────────────
// RESPONSE FORMAT CONVENTION
// ─────────────────────────────────────────────

// Consistent responses make your API predictable and easy to use.
// Decide on a format and stick with it across ALL endpoints.

// Format used in this file:
//
// Success:
// {
//   "success": true,
//   "data": { ... } or [ ... ],
//   "meta": { ... }   (optional — for lists with pagination)
// }
//
// Error:
// {
//   "success": false,
//   "error": {
//     "message": "Human-readable message",
//     "code": "MACHINE_READABLE_CODE",  (optional)
//     "errors": [ ... ]                 (optional — for validation errors)
//   }
// }

// ─────────────────────────────────────────────
// RESPONSE HELPER FUNCTIONS
// ─────────────────────────────────────────────

const Response = {
  // Single resource success
  ok(res, data, statusCode = 200) {
    return res.status(statusCode).json({ success: true, data });
  },

  // Created resource
  created(res, data) {
    return res.status(201).json({ success: true, data });
  },

  // List with pagination metadata
  list(res, data, { total, page, limit }) {
    const totalPages = Math.ceil(total / limit);
    return res.json({
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  },

  // No content (delete success)
  noContent(res) {
    return res.status(204).send();
  },

  // Client error
  badRequest(res, message, errors = null) {
    return res.status(400).json({
      success: false,
      error: { message, ...(errors && { errors }) },
    });
  },

  // Not authenticated
  unauthorized(res, message = "Authentication required") {
    return res.status(401).json({ success: false, error: { message } });
  },

  // Not authorized
  forbidden(res, message = "You don't have permission to do this") {
    return res.status(403).json({ success: false, error: { message } });
  },

  // Resource not found
  notFound(res, resource = "Resource") {
    return res.status(404).json({
      success: false,
      error: { message: `${resource} not found` },
    });
  },

  // Duplicate resource
  conflict(res, message) {
    return res.status(409).json({ success: false, error: { message } });
  },

  // Server error (don't leak internal details in production)
  serverError(res, err = null) {
    const message = "Internal server error";
    console.error(err);
    return res.status(500).json({ success: false, error: { message } });
  },
};

// ─────────────────────────────────────────────
// DEMO DATA
// ─────────────────────────────────────────────

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
];

// ─────────────────────────────────────────────
// ROUTES USING RESPONSE HELPERS
// ─────────────────────────────────────────────

// GET /users — paginated list
app.get("/users", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
  const start = (page - 1) * limit;
  const data = users.slice(start, start + limit);

  Response.list(res, data, { total: users.length, page, limit });
});

// GET /users/:id — single resource
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return Response.notFound(res, "User");
  }

  Response.ok(res, user);
});

// POST /users
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return Response.badRequest(res, "Validation failed", [
      ...(!name ? [{ field: "name", message: "name is required" }] : []),
      ...(!email ? [{ field: "email", message: "email is required" }] : []),
    ]);
  }

  // Check for duplicate email
  if (users.some((u) => u.email === email)) {
    return Response.conflict(res, "A user with this email already exists");
  }

  const user = { id: users.length + 1, name, email, role: "user" };
  users.push(user);

  Response.created(res, user);
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return Response.notFound(res, "User");
  }

  users.splice(index, 1);
  Response.noContent(res);
});

// Demo server error
app.get("/crash", (req, res) => {
  Response.serverError(res, new Error("Something went wrong"));
});

// ─────────────────────────────────────────────
// ERROR MIDDLEWARE
// ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  Response.serverError(res, err);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.path}` },
  });
});

app.listen(PORT, () => {
  console.log(`Response formatting demo at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/users`);
  console.log(`  curl http://localhost:${PORT}/users?page=1&limit=2`);
  console.log(`  curl http://localhost:${PORT}/users/1`);
  console.log(`  curl http://localhost:${PORT}/users/999  — 404`);
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Dave","email":"dave@example.com"}'`);
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Dup","email":"alice@example.com"}'  — 409`);
});
