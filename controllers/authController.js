const User=require('../models/userModel')

//custom error messages
//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = {name:'', email: '', password: ''}

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
        const user =  await User.create({name ,email, password})
        res.status(201).json(user)

    } catch (err) {
        const errors = handleErrors(err)
        // res.status(400).send('error \n'+error)
        res.status(400).json({errors})
    }

}


module.exports.login_post = async (req, res) => {
    const {email, password} = req.body
    console.log(email, password)
    //console.log(req.body)
    res.send('login')
}
