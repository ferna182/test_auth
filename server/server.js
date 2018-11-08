const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()
const port = process.env.PORT || 3000

// DB
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/auth')

const { User } = require('./models/user')
app.use(bodyParser.json())

// POST
app.post('/api/user', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    user.save((err, doc) => {
        if (err) return res.status(400).send(err)
        user.generateAccessToken(function (err, user) {
            if (err) return res.status(400).send(err)

            return res.header('x-access-token', user.access_token).send(user) //do NOT send the user IRL...
        })
    })
})

app.post('/api/user/login', (req, res) => {
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (err) return res.status(400).send(err)

        if (!user) return res.json({ message: 'User not found' })

        user.comparePassword(req.body.password, function (err, match) {
            if (err) return res.status(400).send(err)

            if (match) {
                user.generateAccessToken(function (err, user) {
                    if (err) return res.status(400).send(err)

                    return res.header('x-access-token', user.access_token).send(user) //do NOT send the user IRL...
                })
            } else {
                return res.json({ message: 'Login failed: wrong password' })
            }
        })
    })
})

app.listen(port, () => {
    console.log(`started on port ${port}`)
})

