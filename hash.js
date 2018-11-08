const bcrypt = require('bcrypt')
const {MD5} = require('crypto-js')
const jwt = require('jsonwebtoken')
// bcrypt.genSalt(10, (err, salt)=>{
//     if (err) return next(err)

//     bcrypt.hash("Password1234", salt, (err, hash)=>{
//         console.log(hash)
       
//         bcrypt.compare("Password1234",hash,(err, same)=>{
//             if (same) {
//                 console.log("MATCHED")
//             } else {
//                 console.log("DIDNT MATCH")
//             }
//         })

//         bcrypt.compare("password14",hash,(err, same)=>{
//             if (same) {
//                 console.log("MATCHED")
//             } else {
//                 console.log("DIDNT MATCH")
//             }
//         })
//     })

    
// })

// var user = {
//     id:1,
//     token: MD5('password1234').toString()
// }

// console.log(user)

let id = "1985"
const secret = "secretID"

const token = jwt.sign(id, secret)
const decodeToken = jwt.verify(token, secret)
console.log(token)
console.log(decodeToken)