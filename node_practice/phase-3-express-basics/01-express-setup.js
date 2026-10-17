/**
 * Phase 3, File 01: Express Setup
 *
 * Topics covered:
 *  - Installing and requiring Express
 *  - Creating an Express app
 *  - Defining GET, POST, PUT, DELETE routes
 *  - Using res.json(), res.send(), res.status()
 *  - Starting the server
 *
 * Setup: npm install express
 * Run:   node 01-express-setup.js
 * Test:  curl http://localhost:3000
 */

const express = require("express");

// Create an Express application
const app = express();
const PORT = 3000;

// ─────────────────────────────────────────────
// BUILT-IN MIDDLEWARE
// ─────────────────────────────────────────────

// Parse JSON request bodies (required for POST/PUT requests)
// Without this, req.body will be undefined
app.use(express.json());

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// app.METHOD(PATH, HANDLER)
// METHOD = get, post, put, delete, patch
// PATH = URL string or regex
// HANDLER = function(req, res) { ... }

// GET /
app.get("/", (req, res) => {
  // res.json() automatically:
  // 1. Sets Content-Type: application/json
  // 2. Converts the object to JSON string
  // 3. Sends the response
  res.json({ message: "Welcome to Express!", version: "1.0" });
});

// GET /about
app.get("/about", (req, res) => {
  res.json({
    name: "My Express App",
    description: "Learning Express.js",
    framework: "Express",
  });
});

// GET with URL parameter: /users/:id
app.get("/users/:id", (req, res) => {
  const { id } = req.params; // URL parameters
  const userId = parseInt(id);

  if (isNaN(userId)) {
    // Set status code and send JSON error
    return res.status(400).json({ error: "ID must be a number" });
  }

  // Mock user data
  const user = { id: userId, name: "Alice", email: "alice@example.com" };
  res.json(user);
});

// POST /users — create a new user
app.post("/users", (req, res) => {
  const body = req.body; // parsed automatically by express.json()
  console.log("Received body:", body);

  if (!body.name || !body.email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newUser); // 201 = Created
});

// PUT /users/:id — update a user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  // Simulate updating
  const updated = { id, ...updates, updatedAt: new Date().toISOString() };
  res.json(updated);
});

// DELETE /users/:id — delete a user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Simulate deletion
  console.log(`Deleting user ${id}`);

  // 204 No Content — success but no body
  res.status(204).send();
});

// ─────────────────────────────────────────────
// QUERY PARAMETERS
// ─────────────────────────────────────────────

// GET /search?q=node&limit=10
app.get("/search", (req, res) => {
  const { q, limit = "10" } = req.query; // req.query has all query params

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  res.json({
    query: q,
    limit: parseInt(limit),
    results: [`Result for: ${q}`],
  });
});

// ─────────────────────────────────────────────
// RESPONSE METHODS
// ─────────────────────────────────────────────

// res.json(data)          — send JSON (most common in APIs)
// res.send(data)          — send any type (string, buffer, etc.)
// res.status(code)        — set status code (chainable)
// res.status(201).json(x) — set status AND send JSON
// res.sendStatus(204)     — send status with default message body
// res.redirect('/new')    — redirect the client

app.get("/demo/responses", (req, res) => {
  const type = req.query.type;

  if (type === "text") return res.send("Plain text response");
  if (type === "html") return res.send("<h1>HTML response</h1>");
  if (type === "redirect") return res.redirect("/");
  if (type === "204") return res.sendStatus(204);

  res.json({ message: "Default JSON response" });
});

// ─────────────────────────────────────────────
// 404 HANDLER (must be last)
// ─────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
  console.log("\nTest endpoints:");
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/users/1`);
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com"}'`);
  console.log(`  curl http://localhost:${PORT}/search?q=nodejs`);
});
