 
// the address of the server connected to the network is : 
// url -> http://localhost:8080
// ip -> 127.0.0.1: 8080

const express = require('express')

const app = express() // invoke the express as a function
//ip address is the device and the port is the location in it
const PORT = 8080

let data = ['james']

// middleware
app.use(express.json())

// CRUD - options   create - post / read - get / update - put / delete - delete

// HTTP VERBS (methods) && Routes ( or paths)
// req and the response arguments , are the error fnction
// the method informs the nature of the request ant the route is the further 
// subdirectory (basically we direct the request to the body of the code to respond 
// appropriately , and these locations or routes are called endpoints)


// type - 1
//websites endpoints (these endpoints are for sending back the html and
// they typically coem when a user enters a url in a browser)
app.get('/', (req, res) => {
    // this is endpoint number 1 - /
    console.log('User requested the home-page website.')
    res.send(`
        <body  
        style="background: pink;
        color: blue;">
        

        <h1>DATA:</h1>
        <p>${JSON.stringify
            (data)}</p>
        <a href = "/dashbord"> Dashbord </a>
        </body>
        <script> console.log('This is my script.') </script>
        `)
})

app.get('/dashbord', (req, res) => {
    console.log('the server is satrted')
    res.send(`
        <body>
        <h1>Dashbord</h1>
        <a href = "/"> Home </a>
        
        </body>
        
        `)
})

// type - 2
//api endpoints (non visual)

app.get('/api/data', (req, res)=> {
    console.log('this one is for the data')
    res.send(data)
})


app.post('/api/data', (req, res) => {
    // console.log()
    // when someone wants to create a user (ex : when they click a
    // signup button)
    // the user clicks the sign up button after entering 
    // their credentials, and their browser is wiredu up to sendout the network request to the server to handle that action

    const newEntry = req.body
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/data', (req, res) =>{
    data.pop()
    console.log('We deleted the element at the end of the array')
    res.sendStatus(203)
})



// listen to  the incoming request - specipacally at the port
app.listen(PORT, ()=> console.log(`Server has started on : ${PORT}`)
) 