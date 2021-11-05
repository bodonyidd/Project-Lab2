//Schema: kell a mongodbhez
//schema definiálja ,hogy hogyan néz ki az adat a databaseben
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

const Stock = mongoose.model('stocks', stockSchema) //stocks: Collection név kell (alséma)
module.exports = Stock;