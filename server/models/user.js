const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('./../config/config').get(process.env.NODE_ENV)

const SALT_I = 15

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    access_token:{
        type:String,
        require:true
    }
})

userSchema.pre('save',function(next) {
    var user = this

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,(err, salt)=>{
            if (err) return next(err)
    
            bcrypt.hash(user.password,salt,(err, hash)=>{
                if (err) return next(err)
    
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password,(err, same)=>{
        if (err) return cb(err)

        return cb(null, same)
    })
}

userSchema.methods.generateAccessToken = function(cb){
    let user = this
    let token = jwt.sign(user._id.toHexString(),config.SECRET)
    user.access_token = token
    user.save((err, user)=>{
        if (err) return cb(err)

        return cb(null,user) //maybe not send the user IRL =P
    })
}

userSchema.statics.findByToken = function(token,cb) {
    const user = this
    jwt.verify(token, config.SECRET, (err, decode)=>{
        if (err) return cb(err)

        user.findOne({'_id': decode, 'access_token': token}, (err, user)=>{
            if (err) return cb(err)

            return cb(null, user)
        })
    })
}

userSchema.methods.deleteAccessToken = function(token, cb) {
    const user = this
    user.update({$unset:{access_token:1}},(err,user)=>{
        if (err) return cb(err)

        return cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}