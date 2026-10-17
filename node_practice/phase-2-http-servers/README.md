# Phase 2: HTTP Servers

In this phase you'll build web servers using only Node.js's built-in `http` module — no Express yet. Understanding how HTTP works at this level makes frameworks much easier to understand.

## Files in This Phase

| File | Topic |
|------|-------|
| `01-basic-http-server.js` | Creating your first HTTP server |
| `02-http-methods.js` | Handling GET, POST, PUT, DELETE |
| `03-status-codes.js` | HTTP status codes and when to use them |
| `04-routing.js` | Manual routing without a framework |
| `05-headers.js` | Request and response headers |

## How to Run

```bash
node 01-basic-http-server.js
# Then open http://localhost:3000 in your browser
# or use curl: curl http://localhost:3000
```

Press `Ctrl+C` to stop the server.

## What is HTTP?

**HTTP** (HyperText Transfer Protocol) is the foundation of communication on the web.

**Request/Response cycle:**
1. Client (browser, app, curl) sends a **request** to the server
2. Server processes it and sends back a **response**

**A request includes:**
- Method (GET, POST, PUT, DELETE, etc.)
- URL/path (`/`, `/api/users`, `/api/users/1`)
- Headers (metadata like `Content-Type`, `Authorization`)
- Body (data sent with POST/PUT requests)

**A response includes:**
- Status code (200, 404, 500, etc.)
- Headers
- Body (the actual data, usually JSON or HTML)

## HTTP Methods

| Method | Purpose | Has Body? |
|--------|---------|-----------|
| GET | Retrieve data | No |
| POST | Create new data | Yes |
| PUT | Replace existing data | Yes |
| PATCH | Partially update data | Yes |
| DELETE | Remove data | No |

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — success |
| 201 | Created — new resource created |
| 204 | No Content — success, no body |
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — not authenticated |
| 403 | Forbidden — authenticated but no permission |
| 404 | Not Found — resource doesn't exist |
| 500 | Internal Server Error — something crashed |

## Common Mistakes

- Forgetting to set `Content-Type` header before sending a response
- Not ending the response with `res.end()` (server hangs)
- Forgetting that request body arrives in **chunks** — you need to collect them
- Sending headers after the response body has started (causes errors)
- Not handling errors — unhandled errors crash your server

---

When you understand how HTTP works from scratch, move on to **[Phase 3: Express.js](../phase-3-express-basics/)**.
