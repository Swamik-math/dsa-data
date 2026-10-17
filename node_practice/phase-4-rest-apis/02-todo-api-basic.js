/**
 * Phase 4, File 02: Todo API (Complete CRUD)
 *
 * A complete, production-style Todo REST API with:
 *  - Full CRUD operations
 *  - Input validation
 *  - Consistent response format
 *  - Proper error handling
 *  - Filtering, sorting, pagination
 *
 * Run: node 02-todo-api-basic.js
 */

const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

// ─────────────────────────────────────────────
// DATA STORE (in-memory, resets on restart)
// ─────────────────────────────────────────────

let todos = [
  { id: 1, title: "Learn Node.js", completed: false, priority: "high", createdAt: new Date().toISOString() },
  { id: 2, title: "Build an API", completed: false, priority: "high", createdAt: new Date().toISOString() },
  { id: 3, title: "Write tests", completed: false, priority: "medium", createdAt: new Date().toISOString() },
  { id: 4, title: "Deploy to production", completed: false, priority: "low", createdAt: new Date().toISOString() },
];

let nextId = 5;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const success = (data, meta = {}) => ({ success: true, data, ...meta });
const fail = (message, errors = null) => ({ success: false, error: message, ...(errors && { errors }) });

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// GET /todos — list with filter/sort/paginate
app.get("/todos", (req, res) => {
  let result = [...todos];
  const { completed, priority, sort = "createdAt", order = "asc", page = 1, limit = 10, q } = req.query;

  // Filter by completion
  if (completed !== undefined) {
    result = result.filter((t) => t.completed === (completed === "true"));
  }

  // Filter by priority
  if (priority) {
    result = result.filter((t) => t.priority === priority);
  }

  // Search by title
  if (q) {
    const query = q.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(query));
  }

  // Sort
  result.sort((a, b) => {
    const aVal = a[sort] || "";
    const bVal = b[sort] || "";
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === "desc" ? -cmp : cmp;
  });

  // Paginate
  const total = result.length;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const start = (pageNum - 1) * limitNum;
  const data = result.slice(start, start + limitNum);

  res.json(
    success(data, {
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    })
  );
});

// GET /todos/:id — get one
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));

  if (!todo) {
    return res.status(404).json(fail(`Todo with id ${req.params.id} not found`));
  }

  res.json(success(todo));
});

// POST /todos — create
app.post("/todos", (req, res) => {
  const { title, priority = "medium" } = req.body;
  const validPriorities = ["low", "medium", "high"];
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "title is required and must be a non-empty string" });
  } else if (title.trim().length > 200) {
    errors.push({ field: "title", message: "title must be 200 characters or less" });
  }

  if (!validPriorities.includes(priority)) {
    errors.push({ field: "priority", message: `priority must be one of: ${validPriorities.join(", ")}` });
  }

  if (errors.length > 0) {
    return res.status(400).json(fail("Validation failed", errors));
  }

  const todo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  todos.push(todo);
  res.status(201).json(success(todo));
});

// PUT /todos/:id — full replace
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json(fail(`Todo with id ${id} not found`));
  }

  const { title, completed, priority = "medium" } = req.body;
  const validPriorities = ["low", "medium", "high"];
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "title is required" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push({ field: "completed", message: "completed must be a boolean" });
  }

  if (!validPriorities.includes(priority)) {
    errors.push({ field: "priority", message: `priority must be one of: ${validPriorities.join(", ")}` });
  }

  if (errors.length > 0) {
    return res.status(400).json(fail("Validation failed", errors));
  }

  todos[index] = {
    ...todos[index],
    title: title.trim(),
    completed: completed !== undefined ? completed : todos[index].completed,
    priority,
    updatedAt: new Date().toISOString(),
  };

  res.json(success(todos[index]));
});

// PATCH /todos/:id — partial update
app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json(fail(`Todo with id ${id} not found`));
  }

  const allowed = ["title", "completed", "priority"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json(fail("No valid fields to update"));
  }

  todos[index] = { ...todos[index], ...updates, updatedAt: new Date().toISOString() };
  res.json(success(todos[index]));
});

// DELETE /todos/:id
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json(fail(`Todo with id ${id} not found`));
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// PATCH /todos/:id/complete — convenience endpoint
app.patch("/todos/:id/complete", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json(fail("Todo not found"));

  todo.completed = true;
  todo.completedAt = new Date().toISOString();
  todo.updatedAt = new Date().toISOString();

  res.json(success(todo));
});

// DELETE /todos — delete all completed (bulk operation)
app.delete("/todos/completed", (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => !t.completed);
  const deleted = before - todos.length;

  res.json(success({ deleted, remaining: todos.length }));
});

// GET /todos/stats
app.get("/todos/stats", (req, res) => {
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
    byPriority: {
      high: todos.filter((t) => t.priority === "high").length,
      medium: todos.filter((t) => t.priority === "medium").length,
      low: todos.filter((t) => t.priority === "low").length,
    },
  };
  res.json(success(stats));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json(fail("Internal server error"));
});

// 404
app.use((req, res) => {
  res.status(404).json(fail(`Route not found: ${req.method} ${req.path}`));
});

app.listen(PORT, () => {
  console.log(`Todo API at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/todos`);
  console.log(`  curl http://localhost:${PORT}/todos/stats`);
  console.log(`  curl -X POST http://localhost:${PORT}/todos -H "Content-Type: application/json" -d '{"title":"My new todo","priority":"high"}'`);
  console.log(`  curl -X PATCH http://localhost:${PORT}/todos/1/complete`);
  console.log(`  curl "http://localhost:${PORT}/todos?completed=false&priority=high"`);
});
