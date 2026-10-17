# Phase 4 Exercises

Build real REST APIs from scratch.

---

## Exercise 1: Shopping Cart API

Build a shopping cart REST API with these endpoints:

- `GET /products` — list all products
- `GET /cart` — view current cart items
- `POST /cart` — add item: `{ productId, quantity }`
- `PATCH /cart/:productId` — update quantity: `{ quantity }`
- `DELETE /cart/:productId` — remove item from cart
- `GET /cart/total` — get cart total price

Start data:
```js
const products = [
  { id: 1, name: "Book", price: 15.99 },
  { id: 2, name: "Pen", price: 2.49 },
  { id: 3, name: "Notebook", price: 8.99 },
];
let cart = []; // { productId, quantity }
```

Requirements:
- Validate that `quantity` is a positive integer
- Return 404 if product doesn't exist
- Return the cart with product details and subtotals in `GET /cart`

---

## Exercise 2: Blog API

Build a blog API supporting posts and comments:

**Posts:**
- `GET /posts` — list all posts (with pagination)
- `GET /posts/:id` — get a post
- `POST /posts` — create a post: `{ title, body, author }`
- `PATCH /posts/:id` — update title or body
- `DELETE /posts/:id` — delete post

**Comments:**
- `GET /posts/:id/comments` — list comments for a post
- `POST /posts/:id/comments` — add comment: `{ author, body }`
- `DELETE /posts/:postId/comments/:commentId` — delete a comment

Requirements:
- Validate all required fields
- Return 404 if post/comment not found
- Include comment count in post list response

---

## Exercise 3: Add Rate Limiting

Add a rate limiter to your API that:
- Allows max 10 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded
- Includes a `Retry-After` header with seconds until reset
- Applies to all routes via `app.use()`

---

## Exercise 4: API Documentation Route

Add a `GET /` route to your blog API that returns API documentation:
```json
{
  "name": "Blog API",
  "version": "1.0",
  "baseUrl": "/api/v1",
  "endpoints": {
    "posts": [
      { "method": "GET", "path": "/posts", "description": "List all posts" },
      ...
    ]
  }
}
```

---

## Bonus Challenge: Implement the Full Todo API with Persistence

Take the Todo API from `02-todo-api-basic.js` and:
1. Persist todos to a `todos.json` file using `fs/promises`
2. Load todos from the file when the server starts
3. Save todos to the file after every create/update/delete
4. Add proper error handling if the file doesn't exist yet

This is how small Node.js apps work before you add a real database!
