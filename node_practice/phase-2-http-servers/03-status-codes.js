/**
 * Phase 2, File 03: HTTP Status Codes
 *
 * Topics covered:
 *  - What status codes mean and when to use them
 *  - 2xx Success codes
 *  - 3xx Redirect codes
 *  - 4xx Client error codes
 *  - 5xx Server error codes
 *
 * Run: node 03-status-codes.js
 * Test: curl -i http://localhost:3002/<path>   (the -i flag shows response headers)
 */

const http = require("http");

const PORT = 3002;

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────────
// STATUS CODE REFERENCE
// ─────────────────────────────────────────────

const STATUS_CODES = {
  // 2xx — Success
  200: "OK — Request succeeded, response body contains data",
  201: "Created — New resource was created (use after POST)",
  204: "No Content — Success, but no response body (use after DELETE)",

  // 3xx — Redirects
  301: "Moved Permanently — Resource moved, update your links",
  302: "Found — Temporary redirect",
  304: "Not Modified — Cached version is still valid",

  // 4xx — Client errors (the CLIENT did something wrong)
  400: "Bad Request — Invalid input, missing fields, malformed JSON",
  401: "Unauthorized — Not logged in / no valid credentials",
  403: "Forbidden — Logged in but not allowed to do this",
  404: "Not Found — Resource doesn't exist",
  405: "Method Not Allowed — Wrong HTTP method for this route",
  409: "Conflict — Duplicate resource (e.g., email already registered)",
  422: "Unprocessable Entity — Valid JSON but fails validation rules",
  429: "Too Many Requests — Rate limit exceeded",

  // 5xx — Server errors (the SERVER did something wrong)
  500: "Internal Server Error — Unexpected error (bug in your code)",
  502: "Bad Gateway — Upstream server returned bad response",
  503: "Service Unavailable — Server is overloaded or down for maintenance",
};

Object.entries(STATUS_CODES).forEach(([code, description]) => {
  console.log(`  ${code}: ${description}`);
});

// ─────────────────────────────────────────────
// DEMO SERVER — each route demonstrates a status code
// ─────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const { url } = req;

  // 200 OK — Normal successful response
  if (url === "/ok") {
    sendJSON(res, 200, { message: "Everything is fine!", code: 200 });
    return;
  }

  // 201 Created — After creating a resource
  if (url === "/created") {
    const newResource = { id: 42, name: "New Item", createdAt: new Date().toISOString() };
    sendJSON(res, 201, newResource);
    return;
  }

  // 204 No Content — Success but nothing to return
  if (url === "/no-content") {
    res.statusCode = 204;
    res.end(); // No body!
    return;
  }

  // 301 Redirect — Permanent redirect
  if (url === "/old-path") {
    res.statusCode = 301;
    res.setHeader("Location", "/new-path");
    res.end();
    return;
  }

  if (url === "/new-path") {
    sendJSON(res, 200, { message: "You were redirected here!" });
    return;
  }

  // 400 Bad Request — Client sent invalid data
  if (url === "/bad-request") {
    sendJSON(res, 400, {
      error: "Bad Request",
      message: "The 'name' field is required",
      code: 400,
    });
    return;
  }

  // 401 Unauthorized — Not authenticated
  if (url === "/unauthorized") {
    res.setHeader("WWW-Authenticate", "Bearer");
    sendJSON(res, 401, {
      error: "Unauthorized",
      message: "You must be logged in to access this resource",
      code: 401,
    });
    return;
  }

  // 403 Forbidden — Authenticated but lacks permission
  if (url === "/forbidden") {
    sendJSON(res, 403, {
      error: "Forbidden",
      message: "You don't have permission to access this resource",
      code: 403,
    });
    return;
  }

  // 404 Not Found — Resource doesn't exist
  if (url === "/not-found") {
    sendJSON(res, 404, {
      error: "Not Found",
      message: "The requested resource does not exist",
      code: 404,
    });
    return;
  }

  // 409 Conflict — Duplicate resource
  if (url === "/conflict") {
    sendJSON(res, 409, {
      error: "Conflict",
      message: "A user with this email already exists",
      code: 409,
    });
    return;
  }

  // 429 Too Many Requests
  if (url === "/rate-limited") {
    res.setHeader("Retry-After", "60");
    sendJSON(res, 429, {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Try again in 60 seconds.",
      code: 429,
    });
    return;
  }

  // 500 Internal Server Error — Something crashed in your code
  if (url === "/server-error") {
    sendJSON(res, 500, {
      error: "Internal Server Error",
      message: "Something went wrong on our end. Please try again later.",
      code: 500,
    });
    return;
  }

  // Default 404 for unknown routes
  sendJSON(res, 404, {
    error: "Not Found",
    message: `No route found for ${url}`,
    availableRoutes: [
      "/ok", "/created", "/no-content", "/old-path",
      "/bad-request", "/unauthorized", "/forbidden",
      "/not-found", "/conflict", "/rate-limited", "/server-error",
    ],
  });
});

server.listen(PORT, () => {
  console.log(`\nStatus codes demo at http://localhost:${PORT}`);
  console.log("\nTest routes:");
  console.log("  curl -i http://localhost:3002/ok");
  console.log("  curl -i http://localhost:3002/created");
  console.log("  curl -i http://localhost:3002/not-found");
  console.log("  curl -i http://localhost:3002/server-error");
  console.log("\n(Use -i flag to see status codes and headers)");
});
