/**
 * Phase 2, File 02: HTTP Methods
 *
 * Topics covered:
 *  - Handling GET, POST, PUT, DELETE requests
 *  - Reading the request body (for POST/PUT)
 *  - Parsing JSON from request body
 *
 * Run: node 02-http-methods.js
 *
 * Test with curl:
 *   GET:    curl http://localhost:3001/items
 *   POST:   curl -X POST http://localhost:3001/items -H "Content-Type: application/json" -d '{"name":"Widget"}'
 *   PUT:    curl -X PUT http://localhost:3001/items/1 -H "Content-Type: application/json" -d '{"name":"Updated"}'
 *   DELETE: curl -X DELETE http://localhost:3001/items/1
 */

const http = require("http");

const PORT = 3001;

// Simple in-memory data store (data is lost when server restarts)
let items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
];
let nextId = 3;

// Helper: send JSON response
function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

// Helper: read and parse request body
function getBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString();
      if (!rawBody) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  // ── GET /items ─────────────────────────────
  if (method === "GET" && url === "/items") {
    sendJSON(res, 200, { items });
    return;
  }

  // ── GET /items/:id ─────────────────────────
  const itemMatch = url.match(/^\/items\/(\d+)$/);
  if (method === "GET" && itemMatch) {
    const id = parseInt(itemMatch[1]);
    const item = items.find((i) => i.id === id);
    if (!item) {
      sendJSON(res, 404, { error: "Item not found" });
    } else {
      sendJSON(res, 200, item);
    }
    return;
  }

  // ── POST /items ────────────────────────────
  if (method === "POST" && url === "/items") {
    try {
      const body = await getBody(req);
      if (!body.name) {
        sendJSON(res, 400, { error: "name is required" });
        return;
      }
      const newItem = { id: nextId++, name: body.name };
      items.push(newItem);
      sendJSON(res, 201, newItem); // 201 = Created
    } catch (err) {
      sendJSON(res, 400, { error: err.message });
    }
    return;
  }

  // ── PUT /items/:id ─────────────────────────
  if (method === "PUT" && itemMatch) {
    try {
      const id = parseInt(itemMatch[1]);
      const body = await getBody(req);
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        sendJSON(res, 404, { error: "Item not found" });
        return;
      }

      items[index] = { ...items[index], ...body, id }; // merge, keep id
      sendJSON(res, 200, items[index]);
    } catch (err) {
      sendJSON(res, 400, { error: err.message });
    }
    return;
  }

  // ── DELETE /items/:id ──────────────────────
  if (method === "DELETE" && itemMatch) {
    const id = parseInt(itemMatch[1]);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      sendJSON(res, 404, { error: "Item not found" });
      return;
    }

    items.splice(index, 1);
    res.statusCode = 204; // 204 = No Content (success but no body)
    res.end();
    return;
  }

  // ── Not Found ──────────────────────────────
  sendJSON(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Methods demo running at http://localhost:${PORT}`);
  console.log("\nTry these commands:");
  console.log(`  curl http://localhost:${PORT}/items`);
  console.log(`  curl -X POST http://localhost:${PORT}/items -H "Content-Type: application/json" -d '{"name":"Cherry"}'`);
  console.log(`  curl -X DELETE http://localhost:${PORT}/items/1`);
});
