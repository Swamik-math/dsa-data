const express = require("express")

const router = express.Router()

router.get("/login", (req, res, next) => {
    res.send("this is the login request")
})
module.exports = router