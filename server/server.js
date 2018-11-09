const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('./config/config').get(process.env.NODE_ENV)

const app = express()

// DB
mongoose.Promise = global.Promise
mongoose.connect(config.DATABASE)

const { User } = require('./models/user')
const { auth } = require('./middleware/auth')
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

// GET

app.get('/api/user/profile', auth, (req, res) => {
    res.status(200).send(req.access_token)
})

app.delete('/api/user/logout', auth, (req, res)=>{
    req.user.deleteAccessToken(req.access_token, (err,user) => {
        if (err) return res.status(400).send(err)

        res.status(200).send()
    })
})

app.listen(config.PORT, () => {
    console.log(`started on port ${config.PORT}`)
})

