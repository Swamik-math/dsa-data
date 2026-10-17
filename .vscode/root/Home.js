//import express modules
const express = require("express") //load express
const router = express.Router()

router.get("/home", (req, res, next) => {
    res.send("this is the homepage request")
})

router.get("/about", (req, res) => {
    res.status(200).json({
        name: "swami",
        role:"backend developer"
    })
})

router.get("/swami", (req, res) => {
    res.status(200).json({
        id: "123455",
        college : "mvj"
    })
})

router.get("/profile/:username", (req, res) => {
    res.status(200).json({
        username: req.params.username,
        age: req.query.age || "not provided"
    })
})

router.get("/skills/:topic", (req, res) => {
    res.status(200).json({
        topic: req.params.topic,
        level: req.query.level || "beginner"
    })
})
module.exports = router