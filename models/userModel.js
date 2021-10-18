//kell majd a mongodbhez

const mongoose= require('mongoose')
const validator = require('validator')

const userSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']

    },
    email: {
        type: String,
        required: [true,'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'] 
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    favourites: [String]
})

const User = mongoose.model('User', userSchema)
module.exports = User;