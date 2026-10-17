/**
 * Phase 2, File 04: Routing
 *
 * Topics covered:
 *  - Manual routing based on URL and method
 *  - URL parsing (pathname, query parameters)
 *  - Route parameters (e.g., /users/:id)
 *  - A simple router class
 *
 * Run: node 04-routing.js
 */

const http = require("http");
const { URL } = require("url");

const PORT = 3003;
const BASE_URL = `http://localhost:${PORT}`;

// ─────────────────────────────────────────────
// PARSING URLs
// ─────────────────────────────────────────────

// When a request comes in, req.url might look like:
// /api/users?page=2&limit=10
//
// We need to parse this to get:
//   - pathname: /api/users
//   - query:    { page: "2", limit: "10" }

function parseURL(req) {
  const url = new URL(req.url, BASE_URL);
  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
  };
}

// ─────────────────────────────────────────────
// SIMPLE ROUTER CLASS
// ─────────────────────────────────────────────

class Router {
  constructor() {
    this.routes = [];
  }

  // Register a route: method + path pattern + handler
  add(method, pattern, handler) {
    this.routes.push({ method: method.toUpperCase(), pattern, handler });
  }

  get(pattern, handler) { this.add("GET", pattern, handler); }
  post(pattern, handler) { this.add("POST", pattern, handler); }
  put(pattern, handler) { this.add("PUT", pattern, handler); }
  delete(pattern, handler) { this.add("DELETE", pattern, handler); }

  // Match a request to a route and extract params
  match(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method) continue;

      // Convert route pattern "/users/:id" to a regex.
      // We split on :param segments so that literal parts can be
      // safely escaped (including backslashes) before building the RegExp.
      const paramNames = [];
      const regexStr = route.pattern
        .split(/:([^/]+)/)
        .map((segment, idx) => {
          if (idx % 2 === 0) {
            // Literal segment — escape all regex special characters
            return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\//g, "\\/");
          }
          // Param name segment
          paramNames.push(segment);
          return "([^/]+)";
        })
        .join("");

      const regex = new RegExp(`^${regexStr}$`);
      const match = pathname.match(regex);

      if (match) {
        // Build params object from captured groups
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function sendJSON(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data, null, 2));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

// ─────────────────────────────────────────────
// DEFINE ROUTES
// ─────────────────────────────────────────────

const router = new Router();

// GET /
router.get("/", (req, res) => {
  sendJSON(res, 200, {
    message: "API is running",
    endpoints: ["/users", "/users/:id"],
  });
});

// GET /users  (with optional query params: ?page=1&limit=10)
router.get("/users", (req, res, params, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || users.length;
  const start = (page - 1) * limit;
  const paginated = users.slice(start, start + limit);

  sendJSON(res, 200, {
    data: paginated,
    total: users.length,
    page,
    limit,
  });
});

// GET /users/:id
router.get("/users/:id", (req, res, params) => {
  const id = parseInt(params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    sendJSON(res, 404, { error: "User not found" });
    return;
  }
  sendJSON(res, 200, user);
});

// POST /users
router.post("/users", async (req, res) => {
  try {
    const body = await getBody(req);
    if (!body.name || !body.email) {
      sendJSON(res, 400, { error: "name and email are required" });
      return;
    }
    const newUser = { id: users.length + 1, name: body.name, email: body.email };
    users.push(newUser);
    sendJSON(res, 201, newUser);
  } catch (err) {
    sendJSON(res, 400, { error: err.message });
  }
});

// DELETE /users/:id
router.delete("/users/:id", (req, res, params) => {
  const id = parseInt(params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    sendJSON(res, 404, { error: "User not found" });
    return;
  }
  users.splice(index, 1);
  res.statusCode = 204;
  res.end();
});

// ─────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parseURL(req);
  console.log(`${req.method} ${pathname}`, Object.keys(query).length ? query : "");

  const result = router.match(req.method, pathname);

  if (!result) {
    sendJSON(res, 404, { error: `Route not found: ${req.method} ${pathname}` });
    return;
  }

  try {
    await result.handler(req, res, result.params, query);
  } catch (err) {
    console.error("Unhandled error:", err);
    sendJSON(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Routing demo running at http://localhost:${PORT}`);
  console.log("\nTest endpoints:");
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/users`);
  console.log(`  curl http://localhost:${PORT}/users?page=1&limit=2`);
  console.log(`  curl http://localhost:${PORT}/users/1`);
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Dave","email":"dave@example.com"}'`);
  console.log(`  curl -X DELETE http://localhost:${PORT}/users/1`);
});
