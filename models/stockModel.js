//kell majd a mongodbhez

const mongoose= require('mongoose')


const stockSchema = new  mongoose.Schema({
    Symbol: {
        type: String,
        unique: true,
        required: true

    },
    Description: {
        type: String,
        unique: true,
    }
    
})

const Stock = mongoose.model('Stock', stockSchema)
module.exports = Stock;