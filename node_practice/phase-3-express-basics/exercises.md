# Phase 3 Exercises

Practice building Express applications.

---

## Exercise 1: Products API

Build a products API with Express that:
- `GET /products` — list all products (supports `?category=electronics` filtering)
- `GET /products/:id` — get one product
- `POST /products` — create a product (requires `name`, `price`, `category`)
- `PUT /products/:id` — update a product
- `DELETE /products/:id` — delete a product

Start data:
```js
let products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "T-Shirt", price: 25, category: "clothing" },
  { id: 3, name: "Headphones", price: 149, category: "electronics" },
];
```

<details>
<summary>Solution</summary>

```js
const express = require("express");
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "T-Shirt", price: 25, category: "clothing" },
  { id: 3, name: "Headphones", price: 149, category: "electronics" },
];
let nextId = 4;

app.get("/products", (req, res) => {
  let result = products;
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }
  res.json(result);
});

app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price, category } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ error: "name, price, and category are required" });
  }
  const product = { id: nextId++, name, price, category };
  products.push(product);
  res.status(201).json(product);
});

app.put("/products/:id", (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  res.json(products[idx]);
});

app.delete("/products/:id", (req, res) => {
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  products.splice(idx, 1);
  res.status(204).send();
});

app.listen(4000, () => console.log("Products API on http://localhost:4000"));
```

</details>

---

## Exercise 2: Logging Middleware

Create a middleware function that logs every request in this format:
```
→ GET /products 200 3ms
```

Apply it globally to your app using `app.use()`.

<details>
<summary>Solution</summary>

```js
function logger(req, res, next) {
  const start = Date.now();
  const origJson = res.json.bind(res);
  res.json = function(data) {
    const ms = Date.now() - start;
    console.log(`→ ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
    return origJson(data);
  };
  next();
}

app.use(logger);
```

</details>

---

## Exercise 3: Auth Middleware

Create a middleware that:
1. Reads the `Authorization` header
2. Expects format: `Bearer <username>`
3. Extracts the username and attaches it to `req.user`
4. Returns 401 if missing, 400 if wrong format

Apply it to a `GET /me` route that returns `req.user`.

<details>
<summary>Solution</summary>

```js
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Authorization header required" });
  if (!header.startsWith("Bearer ")) return res.status(400).json({ error: "Use Bearer token" });
  req.user = { username: header.slice(7) };
  next();
}

app.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});
```

</details>

---

## Exercise 4: Error Handling

Add proper error handling to your products API:
1. Create an `AppError` class with `message` and `statusCode`
2. Create an `asyncHandler` wrapper
3. Add a global error handling middleware
4. Throw appropriate errors (400 for validation, 404 for not found)

---

## Bonus Challenge

Build a **notes API** using Express with:
- Express Router in a separate `routes/notes.js` file
- Request validation middleware
- Global error handling
- Proper status codes
- JSON file persistence (read/write to `notes.json`)
