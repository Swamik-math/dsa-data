/**
 * Phase 3, File 06: Error Handling
 *
 * Topics covered:
 *  - Try/catch in route handlers
 *  - Express error handling middleware (4 params)
 *  - Custom error classes
 *  - Async error handling wrapper
 *  - 404 handling
 *
 * Run: node 06-error-handling.js
 */

const express = require("express");
const app = express();
const PORT = 3005;

app.use(express.json());

// ─────────────────────────────────────────────
// CUSTOM ERROR CLASS
// ─────────────────────────────────────────────

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

// Usage: throw new AppError("User not found", 404)

// ─────────────────────────────────────────────
// ASYNC WRAPPER — avoids writing try/catch in every handler
// ─────────────────────────────────────────────

// Without this wrapper, unhandled promise rejections in async routes
// don't get passed to the error handler automatically.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next); // catch → next(err)
};

// ─────────────────────────────────────────────
// MOCK DATA & ASYNC OPERATIONS
// ─────────────────────────────────────────────

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

function findUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((u) => u.id === parseInt(id));
      if (!user) {
        reject(new AppError(`User with id ${id} not found`, 404));
      } else {
        resolve(user);
      }
    }, 50);
  });
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// 1. Manual try/catch (explicit)
app.get("/users/:id/manual", async (req, res) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// 2. Using asyncHandler wrapper (cleaner — error goes to error middleware)
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);
    res.json(user);
  })
);

// 3. Throwing errors inside synchronous code
app.get("/validate", (req, res) => {
  const { age } = req.query;

  if (!age) {
    throw new AppError("age query parameter is required", 400);
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    throw new AppError("age must be a number between 0 and 150", 400);
  }

  res.json({ age: ageNum, category: ageNum >= 18 ? "adult" : "minor" });
});

// 4. Simulating a server error
app.get("/crash", (req, res) => {
  throw new Error("Something went terribly wrong!"); // unhandled → 500
});

// 5. Async crash
app.get(
  "/async-crash",
  asyncHandler(async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error("Async crash!");
  })
);

// ─────────────────────────────────────────────
// 404 HANDLER — must come after all routes
// ─────────────────────────────────────────────

app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404));
});

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE — must have exactly 4 params: (err, req, res, next)
// ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  // Log the error (in production, use a proper logger like winston)
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send appropriate response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Error handling demo at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/users/1        → 200 OK`);
  console.log(`  curl http://localhost:${PORT}/users/999      → 404 Not Found`);
  console.log(`  curl http://localhost:${PORT}/validate?age=25 → valid age`);
  console.log(`  curl http://localhost:${PORT}/validate?age=abc → 400 error`);
  console.log(`  curl http://localhost:${PORT}/crash           → 500 error`);
  console.log(`  curl http://localhost:${PORT}/unknown-route   → 404 error`);
});
