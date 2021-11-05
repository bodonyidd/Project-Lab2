//kell majd a mongodbhez
//schema definiálja ,hogy hogyan fog kinézni az adat a databaseben


const mongoose= require('mongoose')
const {isEmail} = require('validator')

//a tulajdonság nevében nem lehet nagybetű ,mert nem fogműködni 
//pl minLength NEM valid!!! minlength igen!
const userSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter  your name']

    },
    email: {
        type: String,
        required: [true,'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
         
    },
    password: {
        type: String,
        required: [true, 'Please provide your password']
        //minLength: 6
    },
    favourites: [String]
})

const User = mongoose.model('User', userSchema)

module.exports = User;