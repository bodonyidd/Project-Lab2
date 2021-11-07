const User=require('../models/userModel')
const jwt= require('jsonwebtoken')
const cookieParser = require('cookie-parser')


//custom error messages
//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = {name:'', email: '', password: ''}

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'This email is not registered'
    }

    //incorrect pw
    if (err.message === 'incorrect password'){
        errors.password = 'Sorry, incorrect password'
    }

    //duplication key error
    if (err.code === 11000){
        errors.email = "This email is already used by another user"
        return errors
    }
    
    //validation errors
    if (err.message.includes('User validation failed')){
        // console.log(err)
        // Object.values(err.errors).forEach(error => {
        //     console.log(error.properties)
        // })
        //
        //ez a {properties} >>> destructure the properties property from the error 
        Object.values(err.errors).forEach(({properties}) => {
            // console.log(properties)
            errors[properties.path]= properties.message;
        })
    }
    return errors
}
const maxAge= 3*24*60*60
const createToken = (id) =>{
    //1.argument a signben: payload a 2. a secret,  3. az options object
    return jwt.sign({id},'Morzsi Bodri secret', { //ez a morzsis cucc a secret
        expiresIn: maxAge
    })
}


module.exports.signup_get = (req, res) => {
    res.render('signupcopy')
}


module.exports.login_get = (req, res) => {
    res.render('logincopy')
}

//db műveletek
module.exports.signup_post = async (req, res) => {
    const {name ,email, password} = req.body

    try {
        //create creates a 'User' instance locally
        //and saves it into the database 
        const user =  await User.create({name ,email, password}) //'visszaad' és csinál egy usert
        const token = createToken(user._id)
        res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})

    } catch (err) {
        const errors = handleErrors(err)
        // res.status(400).send('error \n'+error)
        res.status(400).json({errors})
    }

}


module.exports.login_post = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(200).json({user: user._id})
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
        
    }
}
