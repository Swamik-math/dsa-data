import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()


// register a new user endpoint /aut/register
router.post('/register', (req, res) => {
    const {username, password} = req.body
    //save the user name and an irreversibally encrypted password
    // save the email.com

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    console.log(username, password)
    res.sendStatus(201)
})

router.post('/login', (req, res) => {
    //we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted , which means that we cannot compare it to the one the uset just used trying to login
    // so what we can to do, is again, one way encrypt the password the user just entered

})


export default router