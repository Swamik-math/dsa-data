const express = require("express")

const homeroute = require("./Home")
const loginroute = require("./login")

const app = express()

app.use((req, res, next) => {
    console.log(req.method + " " + req.path )
    next()
})

app.use("/", homeroute)
app.use("/", loginroute)
app.listen((3000), ()=> {
    console.log("server is running")
})