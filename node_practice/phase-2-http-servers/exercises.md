# Phase 2 Exercises

Practice building HTTP servers without frameworks.

---

## Exercise 1: Your First Server

Create an HTTP server that:
- Listens on port 4000
- Responds to `GET /` with a JSON message: `{ "message": "Server is running!" }`
- Responds to all other routes with a 404 JSON error

<details>
<summary>Solution</summary>

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Server is running!" }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(4000, () => console.log("Listening on port 4000"));
```

</details>

---

## Exercise 2: Books API

Build a simple in-memory books API (no database) that handles:
- `GET /books` — list all books
- `GET /books/:id` — get a book by ID
- `POST /books` — add a new book (body: `{ title, author }`)
- `DELETE /books/:id` — remove a book

Start with this data:
```js
let books = [
  { id: 1, title: "The Pragmatic Programmer", author: "Hunt & Thomas" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin" },
];
```

<details>
<summary>Solution</summary>

```js
const http = require("http");

let books = [
  { id: 1, title: "The Pragmatic Programmer", author: "Hunt & Thomas" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin" },
];
let nextId = 3;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || "{}")); }
      catch { reject(new Error("Invalid JSON")); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const idMatch = url.match(/^\/books\/(\d+)$/);

  if (method === "GET" && url === "/books") {
    send(res, 200, books);
  } else if (method === "GET" && idMatch) {
    const book = books.find(b => b.id === parseInt(idMatch[1]));
    book ? send(res, 200, book) : send(res, 404, { error: "Not found" });
  } else if (method === "POST" && url === "/books") {
    const { title, author } = await getBody(req);
    if (!title || !author) return send(res, 400, { error: "title and author required" });
    const book = { id: nextId++, title, author };
    books.push(book);
    send(res, 201, book);
  } else if (method === "DELETE" && idMatch) {
    const id = parseInt(idMatch[1]);
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return send(res, 404, { error: "Not found" });
    books.splice(idx, 1);
    res.statusCode = 204; res.end();
  } else {
    send(res, 404, { error: "Route not found" });
  }
});

server.listen(4001, () => console.log("Books API on http://localhost:4001"));
```

</details>

---

## Exercise 3: Query Parameters

Extend your books API to support filtering:
- `GET /books?author=Martin` — filter books by author name (partial match)
- `GET /books?limit=1` — limit number of results

<details>
<summary>Solution</summary>

```js
const { URL } = require("url");

// In your GET /books handler:
if (method === "GET" && new URL(req.url, "http://localhost").pathname === "/books") {
  const url = new URL(req.url, "http://localhost");
  const authorFilter = url.searchParams.get("author");
  const limit = parseInt(url.searchParams.get("limit")) || books.length;

  let result = books;
  if (authorFilter) {
    result = result.filter(b =>
      b.author.toLowerCase().includes(authorFilter.toLowerCase())
    );
  }
  result = result.slice(0, limit);
  send(res, 200, result);
}
```

</details>

---

## Exercise 4: Request Logging

Add a logging middleware function that prints the following for every request:
```
[2024-01-15T10:30:00.000Z] GET /books 200 5ms
```

(Hint: Record `Date.now()` at the start, then calculate the difference when sending the response.)

<details>
<summary>Solution</summary>

```js
function createLoggingServer(handler) {
  return http.createServer((req, res) => {
    const start = Date.now();
    const originalEnd = res.end.bind(res);

    res.end = function (...args) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
      return originalEnd(...args);
    };

    handler(req, res);
  });
}
```

</details>

---

## Bonus Challenge

Build a simple **note-taking API** that:
1. Persists notes to a `notes.json` file (using `fs/promises`)
2. Supports GET (list), POST (create), PUT (update), DELETE (delete)
3. Loads existing notes from the file when the server starts
4. Saves to the file whenever data changes
