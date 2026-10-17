/**
 * Phase 4, File 01: REST Principles
 *
 * This file demonstrates REST API design principles through examples.
 * It shows both good and bad patterns so you know what to aim for.
 *
 * Run: node 01-rest-principles.js
 */

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// ─────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────

let articles = [
  { id: 1, title: "REST API Design", category: "backend", published: true, views: 150 },
  { id: 2, title: "Node.js Tips", category: "backend", published: true, views: 89 },
  { id: 3, title: "CSS Grid Guide", category: "frontend", published: false, views: 0 },
];

// ─────────────────────────────────────────────
// PRINCIPLE 1: Use nouns for resource names
// ─────────────────────────────────────────────

// ✅ Good REST endpoints
app.get("/articles", (req, res) => {
  // Filter by category
  const { category, published, sort, order = "asc", page = 1, limit = 10 } = req.query;

  let result = [...articles];

  // Filter
  if (category) {
    result = result.filter((a) => a.category === category);
  }

  if (published !== undefined) {
    result = result.filter((a) => a.published === (published === "true"));
  }

  // Sort
  if (sort && result[0] && sort in result[0]) {
    result.sort((a, b) => {
      if (order === "desc") return b[sort] > a[sort] ? 1 : -1;
      return a[sort] > b[sort] ? 1 : -1;
    });
  }

  // Paginate
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const total = result.length;
  const start = (pageNum - 1) * limitNum;
  result = result.slice(start, start + limitNum);

  res.json({
    data: result,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// ✅ GET /articles/:id — get one resource
app.get("/articles/:id", (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.json(article);
});

// ✅ POST /articles — create resource (not /createArticle!)
app.post("/articles", (req, res) => {
  const { title, category } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const article = {
    id: articles.length + 1,
    title,
    category: category || "general",
    published: false,
    views: 0,
    createdAt: new Date().toISOString(),
  };

  articles.push(article);
  res.status(201).json(article); // 201 = Created
});

// ✅ PATCH /articles/:id — partial update (PUT would replace entirely)
app.patch("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  // Only update fields that were provided
  articles[index] = { ...articles[index], ...req.body, id };

  res.json(articles[index]);
});

// ✅ DELETE /articles/:id
app.delete("/articles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  articles.splice(index, 1);
  res.status(204).send(); // 204 = No Content
});

// ─────────────────────────────────────────────
// PRINCIPLE 2: Use HTTP methods semantically
// ─────────────────────────────────────────────

// ✅ PATCH /articles/:id/publish — custom action using a sub-resource
app.patch("/articles/:id/publish", (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).json({ error: "Not found" });

  article.published = true;
  article.publishedAt = new Date().toISOString();

  res.json(article);
});

// ─────────────────────────────────────────────
// PRINCIPLE 3: Consistent response format
// ─────────────────────────────────────────────

// All responses should follow the same shape.
// This makes life easier for frontend developers using your API.

// Example format:
// Success: { success: true, data: {...} }
// Error:   { success: false, error: "message" }

// ─────────────────────────────────────────────
// PRINCIPLE 4: API versioning
// ─────────────────────────────────────────────

const v1Router = express.Router();
v1Router.get("/status", (req, res) => {
  res.json({ version: "1.0", status: "operational" });
});

app.use("/api/v1", v1Router);

// ─────────────────────────────────────────────
// ROOT — API documentation
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "Articles REST API",
    version: "1.0",
    endpoints: {
      "GET /articles": "List all articles",
      "GET /articles?category=backend": "Filter by category",
      "GET /articles?sort=views&order=desc": "Sort by views",
      "GET /articles?page=1&limit=5": "Paginate",
      "GET /articles/:id": "Get one article",
      "POST /articles": "Create article",
      "PATCH /articles/:id": "Partially update article",
      "PATCH /articles/:id/publish": "Publish an article",
      "DELETE /articles/:id": "Delete article",
    },
  });
});

app.listen(PORT, () => {
  console.log(`REST Principles demo at http://localhost:${PORT}`);
  console.log("\nTest:");
  console.log(`  curl http://localhost:${PORT}/articles`);
  console.log(`  curl http://localhost:${PORT}/articles?category=backend&sort=views&order=desc`);
  console.log(`  curl -X POST http://localhost:${PORT}/articles -H "Content-Type: application/json" -d '{"title":"New Article","category":"backend"}'`);
});
