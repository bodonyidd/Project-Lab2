const jwt = require('jsonwebtoken')
const User=require('../models/userModel')

const requireAuth = (req,res,next) =>{

    const token = req.cookies.jwt

    //check jwt token és hogy valid-e
    if ( token){
        jwt.verify(token, 'Morzsi Bodri secret', (err,decodedToken) => {
            if (err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}


//check current user
const checkUser =  async(req,res,next) => {
    const token = req.cookies.jwt
    if (token){
    jwt.verify(token, 'Morzsi Bodri secret', async (err,decodedToken) => {
        if (err){
            console.log(err.message)
            res.locals.user = null //if the user doesnt exist then we would get error so this command line is against that
            next()
        }else{
            console.log("ddToken:"+decodedToken); //ismétlés: payload: maga az adat ,decodedToken: a user id-t tartalmazza!
            let user = await User.findById(decodedToken.id);
            console.log(user);
            res.locals.user = user;
            next()
        }
    })

}
else {
    res.locals.user = null
    next()

}
}



module.exports = {requireAuth, checkUser}