# Phase 1: JavaScript & Node.js Fundamentals

Before building servers and APIs, you need to be comfortable with JavaScript and the Node.js environment. This phase covers the core building blocks.

## Files in This Phase

| File | Topic |
|------|-------|
| `01-variables-and-functions.js` | Variables, data types, functions, arrow functions |
| `02-objects-and-arrays.js` | Objects, arrays, destructuring, spread/rest |
| `03-callbacks.js` | Callbacks and the event loop |
| `04-promises.js` | Promises and promise chaining |
| `05-async-await.js` | async/await syntax |
| `06-modules-and-npm.js` | CommonJS modules, require/exports, npm |
| `07-file-system.js` | Reading and writing files with the fs module |

## How to Run Examples

```bash
node 01-variables-and-functions.js
node 07-file-system.js
# etc.
```

## Key Concepts

### Why JavaScript for Backend?
- Node.js lets you run JavaScript outside the browser
- Same language for frontend and backend
- Non-blocking I/O makes it great for APIs
- Huge ecosystem (npm has millions of packages)

### Synchronous vs Asynchronous
One of the most important concepts in Node.js:

```
Synchronous:  do task 1 → wait → do task 2 → wait → do task 3
Asynchronous: start task 1, start task 2, start task 3 → handle results as they arrive
```

Node.js is asynchronous by nature — it doesn't wait around while reading files or making network requests.

## Common Mistakes

- Forgetting to handle errors in async code
- Mixing `require` (CommonJS) with `import` (ES Modules) without configuring package.json
- Not understanding that `var` has function scope, not block scope
- Mutating objects/arrays unexpectedly (JavaScript passes objects by reference)

## Exercises

See [exercises.md](./exercises.md) to practice what you've learned.

---

When you're comfortable with all these concepts, move on to **[Phase 2: HTTP Servers](../phase-2-http-servers/)**.
