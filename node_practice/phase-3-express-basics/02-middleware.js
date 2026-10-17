/**
 * Phase 3, File 02: Middleware
 *
 * Topics covered:
 *  - What is middleware?
 *  - Application-level middleware (app.use)
 *  - Route-level middleware
 *  - Built-in middleware
 *  - Creating custom middleware
 *  - Third-party middleware (morgan, cors concepts)
 *
 * Run: node 02-middleware.js
 */

const express = require("express");
const app = express();
const PORT = 3001;

// ─────────────────────────────────────────────
// WHAT IS MIDDLEWARE?
// ─────────────────────────────────────────────

// Middleware is a function with this signature:
//   function middleware(req, res, next) { ... }
//
// It can:
//   - Execute any code
//   - Modify req and res objects
//   - End the request-response cycle
//   - Call next() to pass control to the next middleware
//
// The pipeline looks like:
//   Request → middleware1 → middleware2 → route handler → Response

// ─────────────────────────────────────────────
// BUILT-IN MIDDLEWARE
// ─────────────────────────────────────────────

app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: false })); // parse form data

// ─────────────────────────────────────────────
// CUSTOM MIDDLEWARE: Request Logger
// ─────────────────────────────────────────────

function requestLogger(req, res, next) {
  const start = Date.now();

  // Override res.json to log after response is sent
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    return originalJson(data);
  };

  // Call next() to pass control to the next middleware or route
  next();
}

// Register middleware globally (runs for every request)
app.use(requestLogger);

// ─────────────────────────────────────────────
// CUSTOM MIDDLEWARE: Attach request ID
// ─────────────────────────────────────────────

function attachRequestId(req, res, next) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  req.id = requestId;                    // attach to req so handlers can use it
  res.setHeader("X-Request-Id", requestId); // add to response headers
  next();
}

app.use(attachRequestId);

// ─────────────────────────────────────────────
// CUSTOM MIDDLEWARE: Authentication check
// ─────────────────────────────────────────────

function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  const token = authHeader.slice(7);

  // In a real app, verify the JWT token here
  if (token !== "secret-token-123") {
    return res.status(403).json({ error: "Invalid token" });
  }

  // Attach decoded user info to req
  req.user = { id: 1, name: "Alice", role: "admin" };

  next(); // token is valid, continue
}

// ─────────────────────────────────────────────
// CUSTOM MIDDLEWARE: Rate limiter (simple)
// ─────────────────────────────────────────────

const requestCounts = new Map();

function rateLimiter(maxRequests, windowMs) {
  return function (req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    // Remove old requests outside the window
    const requests = requestCounts.get(ip).filter((t) => now - t < windowMs);
    requests.push(now);
    requestCounts.set(ip, requests);

    if (requests.length > maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil(windowMs / 1000) + " seconds",
      });
    }

    next();
  };
}

// ─────────────────────────────────────────────
// CUSTOM MIDDLEWARE: Input validation factory
// ─────────────────────────────────────────────

function validateBody(requiredFields) {
  return function (req, res, next) {
    const missing = requiredFields.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missing,
      });
    }
    next();
  };
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// Public route — no auth needed
app.get("/", (req, res) => {
  res.json({
    message: "Public endpoint",
    requestId: req.id,
  });
});

// Protected route — uses requireAuth middleware for this route only
app.get("/profile", requireAuth, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
    requestId: req.id,
  });
});

// Rate-limited route
app.get(
  "/limited",
  rateLimiter(5, 60000), // max 5 requests per minute
  (req, res) => {
    res.json({ message: "Rate limited endpoint — max 5 req/min" });
  }
);

// Route with validation middleware
app.post(
  "/users",
  validateBody(["name", "email"]), // middleware runs first
  (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({ id: Date.now(), name, email });
  }
);

// Multiple middleware in sequence
app.get(
  "/admin",
  requireAuth,                                   // first: check auth
  (req, res, next) => {                          // second: check role
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }
    next();
  },
  (req, res) => {                                // third: handle request
    res.json({ message: "Welcome, admin!", user: req.user });
  }
);

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE (must have 4 params)
// ─────────────────────────────────────────────

// Call next(err) from any route to trigger this
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Middleware demo at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/profile  (should get 401)`);
  console.log(`  curl -H "Authorization: Bearer secret-token-123" http://localhost:${PORT}/profile`);
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com"}'`);
});
