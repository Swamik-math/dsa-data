/**
 * Phase 1, File 02: Objects and Arrays
 *
 * Topics covered:
 *  - Creating and accessing objects
 *  - Object methods
 *  - Object destructuring
 *  - Arrays and common array methods
 *  - Array destructuring
 *  - Spread and rest operators
 */

// ─────────────────────────────────────────────
// OBJECTS
// ─────────────────────────────────────────────

// Creating an object
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  isAdmin: false,
};

// Accessing properties
console.log(user.name);          // Alice  (dot notation)
console.log(user["email"]);      // alice@example.com  (bracket notation)

// Adding or updating properties
user.role = "editor";            // add new property
user.age = 26;                   // update existing property
console.log(user);

// Deleting a property
delete user.isAdmin;
console.log(user.isAdmin);       // undefined

// Checking if a property exists
console.log("name" in user);     // true
console.log("isAdmin" in user);  // false

// ─────────────────────────────────────────────
// OBJECT METHODS
// ─────────────────────────────────────────────

const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this; // returning 'this' enables chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  getResult() {
    return this.value;
  },
};

const result = calculator.add(10).add(5).subtract(3).getResult();
console.log(result); // 12

// Useful Object static methods
const person = { firstName: "Bob", lastName: "Smith", age: 30 };

console.log(Object.keys(person));   // ["firstName", "lastName", "age"]
console.log(Object.values(person)); // ["Bob", "Smith", 30]
console.log(Object.entries(person)); // [["firstName","Bob"], ["lastName","Smith"], ["age",30]]

// ─────────────────────────────────────────────
// OBJECT DESTRUCTURING
// ─────────────────────────────────────────────

const { firstName, lastName, age } = person;
console.log(firstName, lastName); // Bob Smith

// Rename while destructuring
const { firstName: fName, lastName: lName } = person;
console.log(fName, lName); // Bob Smith

// Default values
const { firstName: fn, nickname = "No nickname" } = person;
console.log(nickname); // No nickname

// Destructuring in function parameters (very common in Node.js/Express)
function displayUser({ name, email, role = "user" }) {
  console.log(`${name} (${email}) — role: ${role}`);
}
displayUser({ name: "Alice", email: "alice@example.com" });

// ─────────────────────────────────────────────
// ARRAYS
// ─────────────────────────────────────────────

const fruits = ["apple", "banana", "cherry"];

// Accessing elements
console.log(fruits[0]); // apple
console.log(fruits[fruits.length - 1]); // cherry (last element)

// Adding / removing elements
fruits.push("date");         // add to end
fruits.unshift("avocado");   // add to start
const last = fruits.pop();   // remove from end
const first = fruits.shift(); // remove from start
console.log(fruits); // ["banana", "cherry", "date"]

// ─────────────────────────────────────────────
// ESSENTIAL ARRAY METHODS
// ─────────────────────────────────────────────

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map — transform each element, returns new array
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter — keep elements that pass a test, returns new array
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// find — returns first matching element
const firstBig = numbers.find((n) => n > 5);
console.log(firstBig); // 6

// some — returns true if at least one element passes
console.log(numbers.some((n) => n > 9)); // true

// every — returns true if ALL elements pass
console.log(numbers.every((n) => n > 0)); // true

// reduce — accumulate values into a single result
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 55

// includes — check if value exists
console.log(numbers.includes(5)); // true

// indexOf — get position of element
console.log(numbers.indexOf(7)); // 6

// slice — extract portion (non-destructive)
console.log(numbers.slice(2, 5)); // [3, 4, 5]

// sort — sort in place (careful: default sort is alphabetical!)
const words = ["banana", "apple", "cherry"];
words.sort();
console.log(words); // ["apple", "banana", "cherry"]

const nums = [10, 3, 25, 1];
nums.sort((a, b) => a - b); // ascending numeric sort
console.log(nums); // [1, 3, 10, 25]

// ─────────────────────────────────────────────
// ARRAY DESTRUCTURING
// ─────────────────────────────────────────────

const [primary, secondary, ...rest] = ["red", "green", "blue", "yellow"];
console.log(primary);   // red
console.log(secondary); // green
console.log(rest);      // ["blue", "yellow"]

// ─────────────────────────────────────────────
// SPREAD OPERATOR (...)
// ─────────────────────────────────────────────

// Spread with arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Spread with objects (shallow copy / merge)
const defaults = { theme: "light", language: "en", notifications: true };
const userPrefs = { theme: "dark", language: "en" };
const finalPrefs = { ...defaults, ...userPrefs }; // userPrefs overrides defaults
console.log(finalPrefs); // { theme: "dark", language: "en", notifications: true }

// ─────────────────────────────────────────────
// REST PARAMETERS
// ─────────────────────────────────────────────

function sumAll(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

console.log(sumAll(1, 2, 3));       // 6
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// ─────────────────────────────────────────────
// PRACTICAL EXAMPLE: Working with API data
// ─────────────────────────────────────────────

// Imagine this comes from a database
const todos = [
  { id: 1, title: "Learn Node.js", completed: true },
  { id: 2, title: "Build an API", completed: false },
  { id: 3, title: "Deploy to production", completed: false },
];

// Get only incomplete todos
const pending = todos.filter((todo) => !todo.completed);
console.log(pending);

// Get just the titles
const titles = todos.map((todo) => todo.title);
console.log(titles);

// Find a specific todo by ID
const findById = (id) => todos.find((todo) => todo.id === id);
console.log(findById(2)); // { id: 2, title: "Build an API", completed: false }
