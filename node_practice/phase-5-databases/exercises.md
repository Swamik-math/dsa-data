# Phase 5 Exercises

Practice connecting your APIs to a real database.

---

## Exercise 1: SQLite Users API

Set up a SQLite database and build a users API:

1. Install `better-sqlite3`: `npm install better-sqlite3`
2. Create a `users` table with: `id, name, email, age, created_at`
3. Build a complete CRUD API:
   - `GET /users` — list all
   - `GET /users/:id` — get one
   - `POST /users` — create (validate name and email)
   - `PATCH /users/:id` — update
   - `DELETE /users/:id` — delete

Bonus:
- Add `GET /users?search=alice` to search by name
- Add `GET /users?sort=name` to sort results

---

## Exercise 2: Blog with Database

Using SQLite, create a blog API with two tables: `posts` and `comments`.

Schema:
```sql
posts: id, title, body, author, created_at
comments: id, post_id, author, body, created_at
```

Endpoints:
- Full CRUD for `/posts`
- `GET /posts/:id/comments`
- `POST /posts/:id/comments`
- `DELETE /posts/:postId/comments/:commentId`

---

## Exercise 3: Seeding Data

Write a `seed.js` script that:
1. Clears existing data
2. Creates 5 sample users
3. Creates 3 posts per user
4. Logs a success message

```bash
node seed.js
```

---

## Exercise 4: Pagination with Database

Add proper pagination to your users list:

```
GET /users?page=2&limit=5
```

Response should include:
```json
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 2,
    "limit": 5,
    "totalPages": 10
  }
}
```

Use `COUNT(*) OVER()` or a separate COUNT query for the total.

---

## Bonus: Migrate from JSON File to SQLite

Take the Todo API from Phase 4 (with JSON file persistence) and:
1. Replace the JSON file with a SQLite database
2. Create a todos table with all the same fields
3. Rewrite all CRUD operations to use SQL
4. Make sure all existing behavior still works

This is what "migrating" a data store looks like in practice!
