/**
 * Phase 4, File 03: Request Validation
 *
 * Topics covered:
 *  - Manual validation
 *  - Validation helper functions
 *  - Validation middleware pattern
 *  - Common validation rules
 *
 * Run: node 03-request-validation.js
 */

const express = require("express");
const app = express();
const PORT = 3002;

app.use(express.json());

// ─────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────

const validators = {
  required: (value) => value !== undefined && value !== null && value !== "",

  string: (value) => typeof value === "string",

  minLength: (min) => (value) => typeof value === "string" && value.trim().length >= min,

  maxLength: (max) => (value) => typeof value === "string" && value.trim().length <= max,

  number: (value) => typeof value === "number" && !isNaN(value),

  integer: (value) => Number.isInteger(value),

  min: (min) => (value) => typeof value === "number" && value >= min,

  max: (max) => (value) => typeof value === "number" && value <= max,

  boolean: (value) => typeof value === "boolean",

  email: (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  oneOf: (options) => (value) => options.includes(value),

  array: (value) => Array.isArray(value),

  minItems: (min) => (value) => Array.isArray(value) && value.length >= min,
};

// ─────────────────────────────────────────────
// VALIDATION SCHEMA RUNNER
// ─────────────────────────────────────────────

// Define a schema: { fieldName: [{ validator, message }] }
// Returns array of error objects, or empty array if valid

function validate(data, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    for (const rule of rules) {
      const checkFn = typeof rule.check === "function" ? rule.check : validators[rule.check];

      if (!checkFn) continue;

      const valid = checkFn(value);
      if (!valid) {
        errors.push({ field, message: rule.message });
        break; // Only report the first error per field
      }
    }
  }

  return errors;
}

// ─────────────────────────────────────────────
// VALIDATION MIDDLEWARE FACTORY
// ─────────────────────────────────────────────

function validateRequest(schema) {
  return (req, res, next) => {
    const errors = validate(req.body, schema);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors,
      });
    }

    next();
  };
}

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────

const createUserSchema = {
  name: [
    { check: validators.required, message: "name is required" },
    { check: validators.string, message: "name must be a string" },
    { check: validators.minLength(2), message: "name must be at least 2 characters" },
    { check: validators.maxLength(100), message: "name must be 100 characters or less" },
  ],
  email: [
    { check: validators.required, message: "email is required" },
    { check: validators.email, message: "email must be a valid email address" },
  ],
  age: [
    { check: validators.number, message: "age must be a number" },
    { check: validators.min(0), message: "age must be 0 or greater" },
    { check: validators.max(150), message: "age must be 150 or less" },
  ],
};

const createTodoSchema = {
  title: [
    { check: validators.required, message: "title is required" },
    { check: validators.string, message: "title must be a string" },
    { check: validators.minLength(1), message: "title cannot be empty" },
    { check: validators.maxLength(200), message: "title must be 200 characters or less" },
  ],
  priority: [
    { check: validators.oneOf(["low", "medium", "high"]), message: "priority must be low, medium, or high" },
  ],
};

// ─────────────────────────────────────────────
// ROUTES WITH VALIDATION
// ─────────────────────────────────────────────

const users = [];
const todos = [];

// POST /users — validated
app.post("/users", validateRequest(createUserSchema), (req, res) => {
  const { name, email, age } = req.body;
  const user = { id: Date.now(), name: name.trim(), email: email.toLowerCase(), age };
  users.push(user);
  res.status(201).json({ success: true, data: user });
});

// POST /todos — validated with default values
app.post("/todos", (req, res) => {
  const { title, priority = "medium" } = req.body;

  // Validate manually (alternative approach)
  const schema = {
    title: createTodoSchema.title,
    priority: createTodoSchema.priority,
  };

  const errors = validate({ title, priority }, schema);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: "Validation failed", errors });
  }

  const todo = { id: Date.now(), title: title.trim(), priority, completed: false };
  todos.push(todo);
  res.status(201).json({ success: true, data: todo });
});

// PATCH /users/:id — validate only provided fields
app.patch("/users/:id", (req, res) => {
  const { name, email, age } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.push({ field: "name", message: "name must be at least 2 characters" });
    }
  }

  if (email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: "email", message: "email must be a valid email address" });
    }
  }

  if (age !== undefined) {
    if (typeof age !== "number" || age < 0 || age > 150) {
      errors.push({ field: "age", message: "age must be a number between 0 and 150" });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: "Validation failed", errors });
  }

  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});

// Demo: Show validation in action
app.get("/", (req, res) => {
  res.json({
    message: "Validation Demo",
    endpoints: [
      "POST /users — requires name, email; optional age",
      "POST /todos — requires title; optional priority",
      "PATCH /users/:id — all fields optional",
    ],
    examples: {
      "POST /users": { name: "Alice", email: "alice@example.com", age: 25 },
      "POST /todos": { title: "My task", priority: "high" },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Validation demo at http://localhost:${PORT}`);
  console.log("\nTest (valid):");
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","age":25}'`);
  console.log("\nTest (invalid):");
  console.log(`  curl -X POST http://localhost:${PORT}/users -H "Content-Type: application/json" -d '{"name":"A","email":"notanemail"}'`);
});
