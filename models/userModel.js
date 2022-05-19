//kell majd a mongodbhez
//schema definiálja ,hogy hogyan fog kinézni az adat a databaseben


const mongoose= require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

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
        required: [true, 'Please provide your password'],
        minLength: [3, 'The password should contain atleast 3 charackters']
    },
    _favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
    }],
    _transactions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions'
    }]

})


//fire a function after doc saved to db
//post>> nem a get/post request hanem hogy smthg happanening 
//after smthg has happaned 

//after 'save' event > we call a function
//nem arrow functiont használunk hogy a 'this' keywordot elérjük
userSchema.post('save', function(doc,next){
    console.log('new user was created & saved',doc)
    
    
    next() //if we skip this the code will just karikázni fog.(hang)
})

//fire a function before doc  saved to db
//nem arrow functiont használunk hogy a 'this' keywordot elérjük
// userSchema.pre('save', async function(next) {
//     //this >> refers to the local instance to the user
//     console.log('user about to be created & saved',this)
    
    
//     //password hashing+salt >>biztonságot növeli a jelszavaknak
//     //(nem magát a jelszót tároljuk(plain text),+ a salt egy plusz biztonság)    
//     const salt = await bcrypt.genSalt()
//     this.password=await bcrypt.hash(this.password, salt)

//     next()
//     //törölhetők a nem hashelt jelszóval készült próba felhasználók, mert
//     // már csak hasheltet tárolunk és azt nézzük meg hogy
//     // a beírt+salt hash-e egyenlő e a db-ben tárolt hashhel, ami soha nem fog 
//     //egy plain textként tárolt jelszó esetén egyezni 
//  })


 //satic method to login user, bejelentkezéshez kell
 //a login a .statics. után a methódunk neve,amit kreálunk
 userSchema.statics.login = async function(email,password){
     //thissel a User instancre modelre mutatunk

    //  const user = await this.findOne({email: email}) //ez ugyanaz mint az alatta lévő
    const user = await this.findOne({ email })
    if(user) {
        console.log(user,password)
        const auth = await bcrypt.compare(password, user.password) //compare method megoldja az hashelést helyettünk, true ha pass ,false ha nem = 
        if (auth){
            return user 
        }throw Error('incorrect password')
    }throw Error('incorrect email')
 }

const User = mongoose.model('User', userSchema)

module.exports = User;