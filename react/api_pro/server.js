const express  = require('express');
const app = express();
const PORT = 5000

app.use(express.json());

let user = [
    {id: 1, name: 'Alice', email: 'alice@gmail.com'},
];

app.get('/api/users', (req, res) => {
    res.json(users);
})

