
const jwt= require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('../models/userModel');
const bcrypt = require('bcrypt')


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
            console.log(properties)
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
    res.render('signup')
}


module.exports.login_get = (req, res) => {
    res.render('login')
}

//db műveletek
module.exports.signup_post = async (req, res) => {
    const {name ,email, password} = req.body

    try {
        //create creates a 'User' instance locally
        //and saves it into the database 
        const salt = await bcrypt.genSalt()
        const hashedPassword=await bcrypt.hash(password, salt)

        const user =  await User.create({name:name ,email:email, password:hashedPassword})
        const token = createToken(user._id)
        res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000})
        res.status(201).json({user: user._id})

    } catch (err) {
        console.log("sign up error rész")
        const errors = handleErrors(err)
        // res.status(400).send('error \n'+error)
        res.status(400).json({errors})
    }

}


module.exports.login_post = async (req, res) => {
    const {email, password} = req.body
    try {
        // const user = await User.findOne({ email })
        console.log("login userkereses")
        const user = await User.login(email,password)
        
        if(user) {
            console.log(user,password)
        //     if(user.password === password)
        //     {
        //     const auth=true
        //     console.log(auth)
        //     console.log("egyezik a password")
        // }
        const auth = await bcrypt.compare(password, user.password) //compare method megoldja az hashelést helyettünk, true ha pass ,false ha nem = 
            if (auth){
                console.log("bejut az auth ba")
                const token = createToken(user._id)
                console.log("van token")
                res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000})
                console.log("van cookie")
                res.status(200).json({user: user._id})
                console.log("van user")
                // }
    }
            }
        // const token = createToken(user1._id)
        // res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000})
        // res.status(200).json({user: user._id})
    } catch (err) {
        console.log("login error rész")
        const errors = handleErrors(err)
        res.status(400).json({errors})
        
    }
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '',{maxAge: 1})
    res.redirect('/login')
}
