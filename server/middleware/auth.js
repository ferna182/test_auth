const {User} = require('./../models/user')

let auth = (req,res,next) => {
    const token = req.header('x-access-token')

    User.findByToken(token, (err, user) => {
        if (err || !user) return res.status(400).send("error getting user by token")

        req.user = user
        req.access_token = user.access_token  //again, do NOT send the user IRL. this is just testing and playing around.

        next()
    })
}

module.exports = {auth}