const express = require("express");
const fs = require('fs');
const users = require('./MOCK_DATA.json')

const app = express();
const PORT = 8000;

// Middleware - Plugin
app.use(express.urlencoded({extended : false}));

app.use((req, res, next) =>{
    // console.log("Hello from middleware-1");
    // // return res.json({msg: "Hello from middleware-1" });
    // req.myUsername = "supreet.dev";

    fs.appendFile('log.txt', `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`, (err, data) =>
    {
        next();
    }
    );
});


// app.use((req, res, next) =>{
//     console.log("Hello from middleware-2", req.myUsername);
//     // return res.json({msg: "Hello from middleware-1" });
//     // return res.end("Hey");
    
//     next();
// });


// ROUTERS
// getting all the data from the JSON file
app.get('/users', (req, res) => {
    
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

// rest api points
app.get('/api/users', (req, res) =>{
    console.log('I m in get route', req.myUsername);
    return res.json(users);
});


app
    .route("/api/users/:id").get((req, res) =>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id == id);
    
    if (!user) {
        return res.status(404).json({error:"User not found"});
    }
    return res.json(user);
})
// .patch((req, res) => {
//     // edit the user with id
//     const id = Number(req.params.id);
//     const userIndex = users.findIndex((user) => user.id === id);

//     if(userIndex === -1){
//         return res.status(404).json({error:"User not found"});
//     }

//     users[userIndex] = {...users[userIndex], ...req.body};

//     return res.json({
//         status: "success",
//         message: "User updated successfully",
//         user: user[userIndex]
//     });
// })

.delete((req, res) => {
    // delete the user with id
    return res.json({status: "pending"});
});

// get a particular data with entering the user id




app.post("/api/users", (req, res) => {
    // TODO : Create a new user
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {

        return res.json({status: "succcess", id:users.length});
    });
});


app.listen(PORT, () => console.log(`Server Started at PORT :${PORT}`))