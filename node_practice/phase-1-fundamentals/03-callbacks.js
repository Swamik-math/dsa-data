/**
 * Phase 1, File 03: Callbacks
 *
 * Topics covered:
 *  - What is a callback?
 *  - Synchronous vs asynchronous callbacks
 *  - Error-first callback pattern (Node.js convention)
 *  - Callback hell and why it's a problem
 */

// ─────────────────────────────────────────────
// WHAT IS A CALLBACK?
// ─────────────────────────────────────────────

// A callback is simply a function passed to another function
// to be called at a later time.

// Simple synchronous callback
function doSomething(callback) {
  console.log("Doing something...");
  callback(); // call the function that was passed in
}

doSomething(function () {
  console.log("Callback executed!");
});

// Arrow function callback (same thing, shorter)
doSomething(() => console.log("Arrow callback!"));

// ─────────────────────────────────────────────
// CALLBACKS WITH ARRAY METHODS (synchronous)
// ─────────────────────────────────────────────

// map, filter, forEach all take callbacks
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});

// ─────────────────────────────────────────────
// ASYNCHRONOUS CALLBACKS
// ─────────────────────────────────────────────

// setTimeout simulates something that takes time (like a DB query or API call)
console.log("Start");

setTimeout(() => {
  console.log("This runs after 1 second");
}, 1000);

console.log("End"); // This prints BEFORE the setTimeout callback!

// Output order:
// Start
// End
// This runs after 1 second

// This is asynchronous! Node.js doesn't wait around.

// ─────────────────────────────────────────────
// NODE.JS ERROR-FIRST CALLBACK PATTERN
// ─────────────────────────────────────────────

// In Node.js, the convention for callbacks is:
// callback(error, result)
// The FIRST argument is always the error (null if no error)
// The SECOND argument is the successful result

function fetchUser(id, callback) {
  // Simulating an async operation (like a DB query)
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("Invalid user ID"), null); // error case
    } else {
      const user = { id, name: "Alice", email: "alice@example.com" };
      callback(null, user); // success case: first arg is null (no error)
    }
  }, 500);
}

// Using error-first callbacks
fetchUser(1, (err, user) => {
  if (err) {
    console.error("Error:", err.message);
    return; // always return early on error!
  }
  console.log("User found:", user);
});

fetchUser(-1, (err, user) => {
  if (err) {
    console.error("Error:", err.message); // Error: Invalid user ID
    return;
  }
  console.log("User:", user);
});

// ─────────────────────────────────────────────
// REAL EXAMPLE: Reading a file with callbacks
// ─────────────────────────────────────────────

const fs = require("fs");

// fs.readFile uses the error-first callback pattern
fs.readFile(__filename, "utf8", (err, data) => {
  if (err) {
    console.error("Could not read file:", err.message);
    return;
  }
  // Print just the first line of this file
  const firstLine = data.split("\n")[0];
  console.log("First line of this file:", firstLine);
});

// ─────────────────────────────────────────────
// CALLBACK HELL (the problem)
// ─────────────────────────────────────────────

// When you have async operations that depend on each other,
// callbacks get deeply nested — this is "callback hell"

// Simulated async operations
function step1(callback) {
  setTimeout(() => callback(null, "result1"), 100);
}

function step2(data, callback) {
  setTimeout(() => callback(null, data + " + result2"), 100);
}

function step3(data, callback) {
  setTimeout(() => callback(null, data + " + result3"), 100);
}

// Callback hell — deeply nested and hard to read
step1((err, result1) => {
  if (err) return console.error(err);
  step2(result1, (err, result2) => {
    if (err) return console.error(err);
    step3(result2, (err, result3) => {
      if (err) return console.error(err);
      console.log("Final result:", result3);
      // Imagine adding step4, step5... it gets very messy!
    });
  });
});

// ─────────────────────────────────────────────
// SOLUTION: Promises (see 04-promises.js)
// ─────────────────────────────────────────────

// The solution to callback hell is Promises,
// and then async/await (which is built on Promises).
// We'll cover those in the next files!
