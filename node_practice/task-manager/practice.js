
// creating an object
const user = {
    id : 1,
    name : "Alice",
    email : "123@gmail.com",
};

// access
// console.log(user.name);
// console.log(user.id);

// adding properties
user.role = "editor";

delete user.age;
// console.log(user);

// console.log("name" in user);
// console.log("age" in user);

// OBJECT METHODS
const calculator = {
    value : 0,
    add(n) {
        this.value += n;
        return this;
    },

    substract(n) {
        this.value -= n;
        return this;
    },

    getResult(){
        return this.value;
    },
};

const result = calculator.add(10).add(5).substract(5).getResult();
// console.log(result);

const person = {firstName: "Bob", lastName: "Smith", age: 30};

// console.log(Object.keys(person)); //to get the key values
// console.log(Object.values(person)); //to get the values

// OBJECT DESTRUCTION
const {firstName, lastName, age} = person;
// console.log(firstName, lastName);

const {firstName:fName, lastName:lName} = person;
// console.log(fName, lName);

const {firstName:fn, nickName = "no nickname"} = person;
// console.log(fn, nickName);

// Arrays

const fruits = ["apple", "banana", "cherry"];

// console.log(fruits[0]);
// console.log(fruits[fruits.length -1]);

fruits.push("dates");
fruits.unshift("grapes"); // unshift adds the elements at the begining of the array

// fruits.pop();
// fruits.shift();  // pops the elements from the begining
// console.log(fruits);

const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const doubled = number.map((n) => n*2);
// console.log(doubled);

const evens = number.filter((n) => n % 2 == 0);
// console.log(evens);

const firstBig = number.find((n) => n>5);
// console.log(firstBig); // it returns the first matching element

// console.log(number.some((n) => n>9));

// console.log(number.every((n) => n>0));

const sum = number.reduce((acc, n) => acc+n, 0);
// console.log(sum);

// console.log(number.includes(5));
// console.log(number.indexOf(7));
// console.log(number.slice(2, 5));

const words = ["banana", "apple", "cherry"];
words.sort();
// console.log(words);

const nums = [10, 3, 25, 1];
nums.sort((a, b) => a-b);
// console.log(nums);

// ARRAY DESTRUCTION

const [primary, secondary, ...rest] = ["red", "green", "blue", "yellow"];
// console.log(primary);
// console.log(secondary);
// console.log(rest);

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combine = [...arr1, ...arr2];
// console.log(combine);

const defaults = { theme: "light", language: "en", notification: true};
const userPrefs = {theme: "dark", language: "en"};
const finalPrefs = {...defaults, ...userPrefs};
// console.log(finalPrefs);


function sumAll(...nums) {
    return nums.reduce((acc, n) => acc+n, 0);
}

// console.log(sumAll(1, 2, 3));


const todos = [
  { id: 1, title: "Learn Node.js", completed: true },
  { id: 2, title: "Build an API", completed: false },
  { id: 3, title: "Deploy to production", completed: false },
];

// to check whether the todo is completed or not
const pending = todos.filter((todo) => !todo.completed);
// console.log(pending);

const findByID = (id) => todos.find((todo) => todo.id === id);
// console.log(findByID(1));

const titles = todos.map((todo) => todo.title);
// console.log(titles);
