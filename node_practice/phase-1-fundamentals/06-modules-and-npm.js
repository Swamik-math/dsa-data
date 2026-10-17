/**
 * Phase 1, File 06: Modules and npm
 *
 * Topics covered:
 *  - CommonJS module system (require / module.exports)
 *  - Named exports vs default export
 *  - Built-in Node.js modules
 *  - npm: installing and using packages
 *  - Understanding package.json
 */

// ─────────────────────────────────────────────
// COMMONJS MODULES
// ─────────────────────────────────────────────

// Every .js file in Node.js is its own module.
// Variables and functions are PRIVATE by default — not accessible from other files
// unless you explicitly export them.

// ── Exporting from a module ──

// You can export a single value:
//   module.exports = myFunction;

// You can export an object with multiple things:
//   module.exports = { add, subtract, PI };

// Example of what mathUtils.js might look like:
//
// const PI = 3.14159;
//
// function add(a, b) { return a + b; }
// function subtract(a, b) { return a - b; }
//
// module.exports = { add, subtract, PI };

// ── Importing from a module ──
// const { add, subtract, PI } = require('./mathUtils');

// ─────────────────────────────────────────────
// BUILT-IN NODE.JS MODULES
// ─────────────────────────────────────────────

// You don't need to install these — they come with Node.js

// path — work with file and directory paths
const path = require("path");

console.log(path.join("/users", "alice", "documents")); // /users/alice/documents
console.log(path.basename("/users/alice/notes.txt"));   // notes.txt
console.log(path.extname("server.js"));                 // .js
console.log(path.dirname("/users/alice/notes.txt"));    // /users/alice
console.log(__filename); // absolute path to THIS file
console.log(__dirname);  // absolute path to this file's DIRECTORY

// os — operating system information
const os = require("os");

console.log("Platform:", os.platform());     // linux, darwin, win32
console.log("Architecture:", os.arch());     // x64, arm, etc.
console.log("CPUs:", os.cpus().length);      // number of CPU cores
console.log("Free memory:", Math.round(os.freemem() / 1024 / 1024), "MB");
console.log("Home directory:", os.homedir());

// url — parse URLs
const { URL } = require("url");

const myUrl = new URL("https://example.com/api/users?page=1&limit=10");
console.log(myUrl.hostname);               // example.com
console.log(myUrl.pathname);               // /api/users
console.log(myUrl.searchParams.get("page")); // "1"

// events — event emitter (used throughout Node.js internals)
const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("data", (msg) => {
  console.log("Received:", msg);
});

emitter.emit("data", "Hello from event emitter!");

// ─────────────────────────────────────────────
// NPM AND PACKAGE.JSON
// ─────────────────────────────────────────────

// npm is the Node Package Manager — it lets you install third-party packages.

// Initialize a project:
//   npm init          (interactive)
//   npm init -y       (accept all defaults)

// Install a package:
//   npm install express         (save to dependencies)
//   npm install nodemon --save-dev  (save to devDependencies)

// Install all packages listed in package.json:
//   npm install

// Run scripts defined in package.json:
//   npm start         (runs "scripts.start")
//   npm test          (runs "scripts.test")
//   npm run dev       (runs "scripts.dev")

// package.json breakdown:
const packageExample = {
  name: "my-backend",         // project name
  version: "1.0.0",           // semantic version (major.minor.patch)
  description: "A backend API",
  main: "index.js",           // entry point file
  scripts: {
    start: "node index.js",   // npm start
    dev: "nodemon index.js",  // npm run dev  (requires nodemon installed)
    test: "jest",             // npm test
  },
  dependencies: {
    // Required in production
    express: "^4.18.2",
  },
  devDependencies: {
    // Only needed during development
    nodemon: "^3.0.1",
  },
};

console.log("Package structure:", Object.keys(packageExample));

// ─────────────────────────────────────────────
// MODULE PATTERNS IN PRACTICE
// ─────────────────────────────────────────────

// Pattern 1: Export a function
// ─────────────────────────────
// greet.js:
//   function greet(name) { return `Hello, ${name}!`; }
//   module.exports = greet;
//
// main.js:
//   const greet = require('./greet');
//   console.log(greet('Alice'));

// Pattern 2: Export an object (named exports)
// ─────────────────────────────────────────────
// utils.js:
//   const add = (a, b) => a + b;
//   const sub = (a, b) => a - b;
//   module.exports = { add, sub };
//
// main.js:
//   const { add, sub } = require('./utils');

// Pattern 3: Export a class
// ─────────────────────────────
// Database.js:
//   class Database { ... }
//   module.exports = Database;
//
// main.js:
//   const Database = require('./Database');
//   const db = new Database();

// Pattern 4: Export a configured instance
// ─────────────────────────────────────────
// db.js:
//   const sqlite = require('better-sqlite3');
//   const db = sqlite('mydb.db');
//   module.exports = db;  // share the same connection
//
// routes.js:
//   const db = require('./db');  // same db instance

// ─────────────────────────────────────────────
// USEFUL NPM PACKAGES TO KNOW
// ─────────────────────────────────────────────

const packages = {
  express: "Web framework for building APIs",
  nodemon: "Auto-restarts server when files change (dev tool)",
  dotenv: "Load environment variables from .env file",
  cors: "Enable Cross-Origin Resource Sharing",
  morgan: "HTTP request logger",
  joi: "Request body validation",
  bcrypt: "Password hashing",
  jsonwebtoken: "JSON Web Token (JWT) for auth",
  mongoose: "MongoDB object modeling",
  "better-sqlite3": "Fast SQLite library",
};

Object.entries(packages).forEach(([name, description]) => {
  console.log(`  ${name}: ${description}`);
});
