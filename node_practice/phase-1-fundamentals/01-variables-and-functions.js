/**
 * Phase 1, File 01: Variables and Functions
 *
 * Topics covered:
 *  - var, let, const
 *  - Data types (string, number, boolean, null, undefined, object, array)
 *  - Regular functions
 *  - Arrow functions
 *  - Default parameters
 *  - Template literals
 */

// ─────────────────────────────────────────────
// VARIABLES
// ─────────────────────────────────────────────

// var  — function-scoped, avoid in modern code
var oldWay = "avoid var";

// let  — block-scoped, use when value changes
let score = 0;
score = 10; // reassigning is fine

// const — block-scoped, cannot be reassigned (use this by default)
const MAX_SCORE = 100;
const appName = "MyApp";

console.log(score, MAX_SCORE, appName);

// ─────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────

const str = "Hello, World!";       // string
const num = 42;                     // number
const pi = 3.14;                    // number (floats are just numbers in JS)
const isActive = true;              // boolean
const nothing = null;               // null (intentionally empty)
let notDefined;                     // undefined (not yet assigned)
const arr = [1, 2, 3];             // array
const obj = { key: "value" };      // object

console.log(typeof str);       // "string"
console.log(typeof num);       // "number"
console.log(typeof isActive);  // "boolean"
console.log(typeof nothing);   // "object"  ← famous JS quirk, null typeof is "object"
console.log(typeof notDefined); // "undefined"

// ─────────────────────────────────────────────
// TEMPLATE LITERALS
// ─────────────────────────────────────────────

const name = "Alice";
const age = 25;

// Old way (string concatenation)
const greeting1 = "Hello, " + name + "! You are " + age + " years old.";

// Modern way (template literals use backticks)
const greeting2 = `Hello, ${name}! You are ${age} years old.`;

console.log(greeting2); // Hello, Alice! You are 25 years old.

// Multi-line strings
const multiLine = `
  Line one
  Line two
  Line three
`;
console.log(multiLine);

// ─────────────────────────────────────────────
// REGULAR FUNCTIONS
// ─────────────────────────────────────────────

// Function declaration (hoisted — can be called before it's defined)
function add(a, b) {
  return a + b;
}

console.log(add(3, 4)); // 7

// Function expression (not hoisted)
const multiply = function (a, b) {
  return a * b;
};

console.log(multiply(3, 4)); // 12

// Functions with default parameters
function greet(personName = "stranger") {
  return `Hello, ${personName}!`;
}

console.log(greet());         // Hello, stranger!
console.log(greet("Bob"));    // Hello, Bob!

// ─────────────────────────────────────────────
// ARROW FUNCTIONS (modern, concise syntax)
// ─────────────────────────────────────────────

// Traditional function
function square(x) {
  return x * x;
}

// Arrow function (equivalent)
const squareArrow = (x) => {
  return x * x;
};

// Shorthand: if there's only one expression, you can omit {} and return
const squareShort = (x) => x * x;

console.log(square(5));       // 25
console.log(squareArrow(5));  // 25
console.log(squareShort(5));  // 25

// Arrow function with no parameters
const sayHello = () => "Hello!";
console.log(sayHello()); // Hello!

// Arrow function with multiple parameters
const addTwo = (a, b) => a + b;
console.log(addTwo(10, 20)); // 30

// ─────────────────────────────────────────────
// PRACTICAL EXAMPLE: A Simple Utility Module
// ─────────────────────────────────────────────

// These are the kinds of helper functions you'll write in real backends

const formatPrice = (price) => `$${price.toFixed(2)}`;
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const isEven = (n) => n % 2 === 0;

console.log(formatPrice(9.9));     // $9.90
console.log(capitalize("hello"));  // Hello
console.log(isEven(4));            // true
console.log(isEven(7));            // false
