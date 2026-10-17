# Phase 3: Express.js

Express is the most popular Node.js web framework. It takes all the manual work from Phase 2 and gives you a clean, minimal API for building servers.

## Files in This Phase

| File | Topic |
|------|-------|
| `01-express-setup.js` | Setting up Express, basic routes |
| `02-middleware.js` | Middleware concept and custom middleware |
| `03-routing.js` | Express Router, organizing routes |
| `04-static-files.js` | Serving HTML, CSS, images |
| `05-request-response.js` | req and res objects in detail |
| `06-error-handling.js` | Error handling patterns |

## Setup

Before running these examples, install Express:

```bash
npm install express
```

## Running Examples

```bash
node 01-express-setup.js
```

Then test with curl or open in browser.

## Why Express?

Compare Phase 2 code to Express:

**Without Express (raw Node.js):**
```js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
  }
});
```

**With Express:**
```js
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.json(users);  // sets headers and status automatically!
});
```

Express handles:
- Parsing request bodies automatically
- Setting Content-Type headers automatically
- Route matching (including URL params)
- Middleware system for reusable logic
- Error handling

## Key Concepts

### What is Middleware?
Middleware is a function that runs between the request and the response. Think of it as a pipeline:

```
Request → middleware1 → middleware2 → route handler → Response
```

Each middleware has access to `req`, `res`, and `next` (to pass to the next middleware).

### Common Built-in Middleware
- `express.json()` — parse JSON request bodies
- `express.urlencoded()` — parse form data
- `express.static()` — serve static files

## Common Mistakes

- Forgetting `express.json()` middleware (body is undefined without it)
- Calling `next()` after already sending a response (causes errors)
- Putting error handling middleware LAST (it must be after all routes)
- Not calling `next(err)` to pass errors to error handlers

---

After completing this phase, you'll be ready for **[Phase 4: REST APIs](../phase-4-rest-apis/)**.
