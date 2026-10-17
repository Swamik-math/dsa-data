/**
 * Phase 3, File 04: Static Files
 *
 * Topics covered:
 *  - Serving static HTML, CSS, JS files
 *  - express.static() middleware
 *  - Serving from a public directory
 *
 * Run: node 04-static-files.js
 * Open: http://localhost:3003
 *
 * Note: This file creates a small 'public' folder to demonstrate static serving.
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3003;

// Create a 'public' directory with sample files for the demo
const publicDir = path.join(__dirname, "public-demo");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });

  // Create a sample HTML file
  fs.writeFileSync(
    path.join(publicDir, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Static Files Demo</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Hello from Static Files!</h1>
  <p>This HTML file is served by Express static middleware.</p>
  <button onclick="fetchData()">Fetch API Data</button>
  <pre id="output"></pre>
  <script src="/app.js"></script>
</body>
</html>`
  );

  // Create a sample CSS file
  fs.writeFileSync(
    path.join(publicDir, "style.css"),
    `body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
h1 { color: #333; }
button { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
pre { background: #f4f4f4; padding: 16px; border-radius: 4px; overflow-x: auto; }`
  );

  // Create a sample client-side JS file
  fs.writeFileSync(
    path.join(publicDir, "app.js"),
    `function fetchData() {
  fetch('/api/info')
    .then(res => res.json())
    .then(data => {
      document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    })
    .catch(err => console.error(err));
}`
  );

  console.log("Created public-demo directory with sample files");
}

// ─────────────────────────────────────────────
// SERVING STATIC FILES
// ─────────────────────────────────────────────

// express.static() serves files from a directory
// When a request comes in for /style.css, it looks for style.css in publicDir
app.use(express.static(publicDir));

// You can also serve from a URL prefix:
// app.use('/static', express.static(publicDir));
// Then access files at: /static/style.css

// ─────────────────────────────────────────────
// API ROUTE (alongside static files)
// ─────────────────────────────────────────────

app.get("/api/info", (req, res) => {
  res.json({
    message: "This is the API response",
    timestamp: new Date().toISOString(),
    server: "Express Static Demo",
  });
});

// ─────────────────────────────────────────────
// SERVING A SPECIFIC HTML FILE
// ─────────────────────────────────────────────

// Read the HTML at startup so we can serve it without per-request fs access.
const indexHtml = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");

// If you want a route to serve an HTML file explicitly:
app.get("/custom-page", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(indexHtml);
});

// Fallback: serve index.html for unknown routes (useful for Single Page Apps)
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(indexHtml);
});

app.listen(PORT, () => {
  console.log(`Static files demo at http://localhost:${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/info`);
});
