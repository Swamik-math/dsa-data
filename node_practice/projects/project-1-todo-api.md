# Project 1: Todo API

Build a complete, production-quality Todo REST API. This is your first real project — it will tie together everything from Phases 1–4.

## Learning Goals

- Build a full CRUD REST API
- Apply proper REST conventions
- Use consistent response formatting
- Handle errors properly
- (Optional) Add database persistence

## Requirements

### Core Features

- [ ] Full CRUD for todos: Create, Read, Update, Delete
- [ ] Filtering: `?completed=true`, `?priority=high`
- [ ] Search: `?q=learn`
- [ ] Sorting: `?sort=createdAt&order=desc`
- [ ] Pagination: `?page=1&limit=10`
- [ ] Input validation with helpful error messages
- [ ] Consistent JSON response format

### API Endpoints

```
GET    /api/v1/todos               — list todos (with filter/sort/paginate)
GET    /api/v1/todos/stats         — todo statistics
GET    /api/v1/todos/:id           — get one todo
POST   /api/v1/todos               — create todo
PUT    /api/v1/todos/:id           — replace todo
PATCH  /api/v1/todos/:id           — partial update
PATCH  /api/v1/todos/:id/complete  — mark as complete
DELETE /api/v1/todos/:id           — delete todo
DELETE /api/v1/todos/completed     — delete all completed
```

### Todo Schema

```json
{
  "id": 1,
  "title": "Learn Node.js",
  "description": "Complete the backend learning repository",
  "completed": false,
  "priority": "high",
  "tags": ["learning", "nodejs"],
  "dueDate": "2024-12-31",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": null,
  "completedAt": null
}
```

### Response Format

All responses should follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**List with pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Todo not found",
    "errors": []
  }
}
```

## Folder Structure

```
todo-api/
├── package.json
├── server.js          (entry point — start server here)
├── app.js             (express app setup — no server.listen)
├── routes/
│   └── todoRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── validate.js
└── data/
    └── todos.json     (or use SQLite for bonus)
```

## Implementation Steps

### Step 1: Project Setup
```bash
mkdir todo-api
cd todo-api
npm init -y
npm install express
npm install nodemon --save-dev
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Create app.js
```js
const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/api/v1/todos', todoRoutes);

app.use(errorHandler);

module.exports = app;
```

### Step 3: Create routes/todoRoutes.js
Implement all the routes using `express.Router()`.

### Step 4: Create middleware/errorHandler.js
```js
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: { message: err.message },
  });
};
```

### Step 5: Create server.js
```js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Testing Your API

Use curl or Postman:

```bash
# Create a todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","priority":"high"}'

# List all todos
curl http://localhost:3000/api/v1/todos

# Filter by priority
curl "http://localhost:3000/api/v1/todos?priority=high&completed=false"

# Mark as complete
curl -X PATCH http://localhost:3000/api/v1/todos/1/complete

# Get stats
curl http://localhost:3000/api/v1/todos/stats
```

## Bonus Challenges

- [ ] Add SQLite or JSON file persistence (data survives server restarts)
- [ ] Add `dueDate` support and a `GET /todos/overdue` endpoint
- [ ] Add `tags` array and filter by tag: `?tag=nodejs`
- [ ] Add request logging middleware
- [ ] Add rate limiting
- [ ] Write a `seed.js` script that creates sample todos
