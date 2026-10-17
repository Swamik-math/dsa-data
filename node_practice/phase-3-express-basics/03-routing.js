/**
 * Phase 3, File 03: Routing
 *
 * Topics covered:
 *  - express.Router() for organizing routes
 *  - Splitting routes into separate files
 *  - Nested routes
 *  - Route parameters
 *  - app.use() to mount routers at a path
 *
 * Run: node 03-routing.js
 */

const express = require("express");
const app = express();
const PORT = 3002;

app.use(express.json());

// ─────────────────────────────────────────────
// DATA (mock databases)
// ─────────────────────────────────────────────

let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

let posts = [
  { id: 1, userId: 1, title: "Hello World", body: "My first post!" },
  { id: 2, userId: 1, title: "Node.js Tips", body: "Always use async/await." },
  { id: 3, userId: 2, title: "Express Guide", body: "Express is great." },
];

// ─────────────────────────────────────────────
// USER ROUTER
// ─────────────────────────────────────────────

// In a real app, this would be in /routes/userRoutes.js
const userRouter = express.Router();

// GET /users
userRouter.get("/", (req, res) => {
  res.json(users);
});

// GET /users/:id
userRouter.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// GET /users/:id/posts — nested route: posts belonging to a user
userRouter.get("/:id/posts", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const userPosts = posts.filter((p) => p.userId === userId);
  res.json({ user, posts: userPosts });
});

// POST /users
userRouter.post("/", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH /users/:id — partial update
userRouter.patch("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  users[index] = { ...users[index], ...req.body, id }; // keep id
  res.json(users[index]);
});

// DELETE /users/:id
userRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  users.splice(index, 1);
  res.status(204).send();
});

// ─────────────────────────────────────────────
// POST ROUTER
// ─────────────────────────────────────────────

const postRouter = express.Router();

// GET /posts
postRouter.get("/", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const filtered = posts.filter((p) => p.userId === parseInt(userId));
    return res.json(filtered);
  }
  res.json(posts);
});

// GET /posts/:id
postRouter.get("/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// POST /posts
postRouter.post("/", (req, res) => {
  const { userId, title, body } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ error: "userId, title, and body are required" });
  }
  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) return res.status(404).json({ error: "User not found" });

  const newPost = { id: posts.length + 1, userId: parseInt(userId), title, body };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// DELETE /posts/:id
postRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Post not found" });
  posts.splice(index, 1);
  res.status(204).send();
});

// ─────────────────────────────────────────────
// MOUNT ROUTERS — tell Express which prefix to use
// ─────────────────────────────────────────────

// All userRouter routes are prefixed with /users
app.use("/users", userRouter);

// All postRouter routes are prefixed with /posts
app.use("/posts", postRouter);

// ─────────────────────────────────────────────
// ROOT ROUTE
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "Express Routing Demo",
    endpoints: {
      users: ["GET /users", "GET /users/:id", "GET /users/:id/posts", "POST /users", "PATCH /users/:id", "DELETE /users/:id"],
      posts: ["GET /posts", "GET /posts?userId=1", "GET /posts/:id", "POST /posts", "DELETE /posts/:id"],
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`Routing demo at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/users`);
  console.log(`  curl http://localhost:${PORT}/users/1/posts`);
  console.log(`  curl http://localhost:${PORT}/posts?userId=1`);
});
