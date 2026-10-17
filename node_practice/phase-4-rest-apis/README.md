# Phase 4: REST APIs

In this phase you'll build a complete, production-quality REST API. You'll apply everything from previous phases and learn REST best practices.

## Files in This Phase

| File | Topic |
|------|-------|
| `01-rest-principles.js` | REST concepts and API design rules |
| `02-todo-api-basic.js` | Complete CRUD Todo API |
| `03-request-validation.js` | Validating request input |
| `04-response-formatting.js` | Consistent response formatting |

## Setup

```bash
npm install express
```

## What is REST?

**REST** (Representational State Transfer) is an architectural style for designing APIs. A RESTful API uses:

- **Resources** — nouns, not verbs (`/users`, not `/getUsers`)
- **HTTP methods** — to indicate what action to perform
- **Status codes** — to indicate what happened
- **JSON** — for data exchange (usually)

## REST Design Rules

### 1. Use nouns for endpoints
```
✅ GET /users          — list users
✅ GET /users/1        — get user 1
✅ POST /users         — create a user
❌ GET /getUsers
❌ POST /createUser
```

### 2. Use HTTP methods correctly
```
GET    /todos      → list all todos
GET    /todos/1    → get todo 1
POST   /todos      → create todo
PUT    /todos/1    → replace todo 1 entirely
PATCH  /todos/1    → partially update todo 1
DELETE /todos/1    → delete todo 1
```

### 3. Use correct status codes
```
200 OK            — successful GET, PUT, PATCH
201 Created       — successful POST
204 No Content    — successful DELETE
400 Bad Request   — validation error
401 Unauthorized  — not authenticated
403 Forbidden     — not authorized
404 Not Found     — resource doesn't exist
500 Server Error  — bug in your code
```

### 4. Nest resources for relationships
```
GET /users/1/posts        — posts belonging to user 1
GET /users/1/posts/5      — post 5 of user 1
POST /users/1/posts       — create a post for user 1
```

### 5. Use query params for filtering/sorting/pagination
```
GET /todos?completed=true         — filter
GET /todos?sort=createdAt&order=desc — sort
GET /todos?page=2&limit=10        — paginate
GET /todos?q=nodejs               — search
```

## API Versioning

For production APIs, version your API to avoid breaking changes:
```
/api/v1/users
/api/v2/users
```

## Common Mistakes

- Using verbs in endpoint names (`/createUser`, `/deletePost`)
- Returning 200 for all responses, even errors
- Returning different response shapes for different routes
- Not validating input before using it
- Exposing internal errors to clients in production
- Not paginating large lists

---

After completing this phase, move on to **[Phase 5: Databases](../phase-5-databases/)**.
