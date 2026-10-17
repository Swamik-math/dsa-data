// function greet(name){
//     console.log(`Hello, ${name}!`);
// }
// greet("Alice");
// greet("Suzuki");

// function add(a, b){
//     const sum = a+b;
//     return sum;
// }

// console.log(add(10, 5));

// function square(n){
//     return n*n;
// }

// arrow function
// const square = (n) => {
//     return n*n;
// }
// const square = (n) => n*n;

// Arrow functions are more modern and shorter
// Use them for simple operations

// multiline string
const multiLine = `
    Line one
    Line two
    Line three
`;
// console.log(multiLine);

function add(a, b){
    return a+b;
}
// console.log(add(5, 7));

//by default parameters
function greet(name = "stranger"){
    return `Hello, ${name}!`;
}

// console.log(greet());


// Arrow function
const arrowSquare = (x) => {
    return x*x;
}

// console.log(arrowSquare(5));

// arrow functoin with no parameter
const sayHello = () => "Hello!";
console.log(sayHello());

const formatPrice = (price) => `$${price.toFixed(2)}`;
                                // convert the number to string and keeps exactly 2 decimal places
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

console.log(formatPrice(9.9));  
console.log(capitalize("supreet"));
