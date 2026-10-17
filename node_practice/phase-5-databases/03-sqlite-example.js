/**
 * Phase 5, File 03: SQLite Example
 *
 * A complete Express REST API backed by a real SQLite database.
 *
 * Topics covered:
 *  - Connecting to SQLite with better-sqlite3
 *  - Creating tables with migrations
 *  - CRUD operations with SQL
 *  - Parameterized queries (prevent SQL injection)
 *  - Relationships (users + posts)
 *  - Transactions
 *
 * Setup:
 *   npm install express better-sqlite3
 *
 * Run: node 03-sqlite-example.js
 */

const express = require("express");
// NOTE: Install better-sqlite3 before running: npm install better-sqlite3
// const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(express.json());

// ─────────────────────────────────────────────
// DATABASE SETUP
// ─────────────────────────────────────────────

// Uncomment this block after running: npm install better-sqlite3
/*
const path = require("path");
const db = new Database(path.join(__dirname, "app.db"));

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Create tables if they don't exist (migration)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL,
    published  INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
`);
*/

// ─────────────────────────────────────────────
// PREPARED STATEMENTS
// ─────────────────────────────────────────────

// Prepared statements:
// 1. Are compiled once and reused → better performance
// 2. Use placeholders (?) → prevents SQL injection
// 3. Are synchronous with better-sqlite3

/*
const userStmts = {
  getAll:    db.prepare("SELECT * FROM users ORDER BY created_at DESC"),
  getById:   db.prepare("SELECT * FROM users WHERE id = ?"),
  getByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  create:    db.prepare("INSERT INTO users (name, email) VALUES (?, ?)"),
  update:    db.prepare("UPDATE users SET name = ? WHERE id = ?"),
  delete:    db.prepare("DELETE FROM users WHERE id = ?"),
};

const postStmts = {
  getAll:     db.prepare("SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC"),
  getById:    db.prepare("SELECT p.*, u.name as author_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?"),
  getByUser:  db.prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC"),
  create:     db.prepare("INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)"),
  update:     db.prepare("UPDATE posts SET title = ?, body = ? WHERE id = ?"),
  publish:    db.prepare("UPDATE posts SET published = 1 WHERE id = ?"),
  delete:     db.prepare("DELETE FROM posts WHERE id = ?"),
};
*/

// ─────────────────────────────────────────────
// USER ROUTES
// ─────────────────────────────────────────────

/*
// GET /users
app.get("/users", (req, res) => {
  const users = userStmts.getAll.all();
  res.json({ success: true, data: users });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const user = userStmts.getById.get(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, data: user });
});

// POST /users
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "name and email are required" });
  }

  // Check for duplicate email
  const existing = userStmts.getByEmail.get(email);
  if (existing) {
    return res.status(409).json({ success: false, error: "Email already registered" });
  }

  try {
    const result = userStmts.create.run(name.trim(), email.toLowerCase().trim());
    const newUser = userStmts.getById.get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Could not create user" });
  }
});

// PATCH /users/:id
app.patch("/users/:id", (req, res) => {
  const { name } = req.body;
  const user = userStmts.getById.get(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  userStmts.update.run(name || user.name, req.params.id);
  const updated = userStmts.getById.get(req.params.id);
  res.json({ success: true, data: updated });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const user = userStmts.getById.get(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  userStmts.delete.run(req.params.id);
  res.status(204).send();
});
*/

// ─────────────────────────────────────────────
// POST ROUTES
// ─────────────────────────────────────────────

/*
// GET /posts
app.get("/posts", (req, res) => {
  const posts = postStmts.getAll.all();
  res.json({ success: true, data: posts });
});

// GET /users/:id/posts
app.get("/users/:id/posts", (req, res) => {
  const user = userStmts.getById.get(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  const posts = postStmts.getByUser.all(req.params.id);
  res.json({ success: true, data: posts });
});

// POST /posts
app.post("/posts", (req, res) => {
  const { userId, title, body } = req.body;

  if (!userId || !title || !body) {
    return res.status(400).json({ success: false, error: "userId, title, and body are required" });
  }

  const user = userStmts.getById.get(userId);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  const result = postStmts.create.run(userId, title.trim(), body.trim());
  const newPost = postStmts.getById.get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: newPost });
});

// PATCH /posts/:id/publish
app.patch("/posts/:id/publish", (req, res) => {
  const post = postStmts.getById.get(req.params.id);
  if (!post) return res.status(404).json({ success: false, error: "Post not found" });

  postStmts.publish.run(req.params.id);
  const updated = postStmts.getById.get(req.params.id);
  res.json({ success: true, data: updated });
});

// DELETE /posts/:id
app.delete("/posts/:id", (req, res) => {
  const post = postStmts.getById.get(req.params.id);
  if (!post) return res.status(404).json({ success: false, error: "Post not found" });

  postStmts.delete.run(req.params.id);
  res.status(204).send();
});
*/

// ─────────────────────────────────────────────
// TRANSACTION EXAMPLE
// ─────────────────────────────────────────────

/*
// Create a user and their first post in a single transaction
app.post("/users/with-post", (req, res) => {
  const { name, email, postTitle, postBody } = req.body;

  if (!name || !email || !postTitle || !postBody) {
    return res.status(400).json({ error: "All fields required" });
  }

  // db.transaction wraps multiple operations
  const createUserWithPost = db.transaction((userData, postData) => {
    const userResult = userStmts.create.run(userData.name, userData.email);
    const userId = userResult.lastInsertRowid;
    const postResult = postStmts.create.run(userId, postData.title, postData.body);
    return {
      user: userStmts.getById.get(userId),
      post: postStmts.getById.get(postResult.lastInsertRowid),
    };
  });

  try {
    const result = createUserWithPost(
      { name, email },
      { title: postTitle, body: postBody }
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      return res.status(409).json({ error: "Email already taken" });
    }
    res.status(500).json({ error: "Could not create user" });
  }
});
*/

// ─────────────────────────────────────────────
// PLACEHOLDER — run without better-sqlite3
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "SQLite Example",
    instructions: [
      "1. Run: npm install better-sqlite3",
      "2. Uncomment the code blocks in this file",
      "3. Restart the server",
    ],
    endpoints: [
      "GET /users",
      "GET /users/:id",
      "POST /users",
      "PATCH /users/:id",
      "DELETE /users/:id",
      "GET /posts",
      "GET /users/:id/posts",
      "POST /posts",
      "PATCH /posts/:id/publish",
      "DELETE /posts/:id",
      "POST /users/with-post  (transaction example)",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`SQLite example at http://localhost:${PORT}`);
  console.log('Run "npm install better-sqlite3" then uncomment the code to enable the database!');
});
