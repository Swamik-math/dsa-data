// function doSomething(callback){
//     console.log("Doing something...");
//     callback();
// }

// // doSomething(function (){
// //     console.log("Callback Executed! ");
// // })

// doSomething(() => console.log("Arrow callback!"));

const numb = [1, 2, 3, 4, 5];

// numb.forEach((num, index) => {
//     console.log(`Index ${index} : ${num}`);
// });


// console.log("start");

// setTimeout(() => {
//     console.log("This runs after 1 second");
// }, 5000); //this runs after 5 seconds

// console.log("End");

function fetchUser(id, callback){
    setTimeout(() =>{
        if(id <= 0){
            callback(new Error("Invalid user ID"), null);
        }else{
            const user = {id, name:"Alice", email:"123@gmail.com"};
            callback(null, user);
        }
    }, 5000); 
}

fetchUser(-1, (err, user) => {
    if(err) {
        console.error("Error: ", err.message);
        return;
    }
    console.log("User: ", user);
});


const fs = require("fs");

fs.readFile(__filename, "utf8", (err, data) => {
    if(err){
        console.log("Could not read file: ", err.message);
        return;
    }
    const firstLine = data.split("\n")[0];
    console.log("First line of this file: ", firstLine);

});