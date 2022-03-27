//Schema: kell a mongodbhez
//schema definiálja ,hogy hogyan néz ki az adat a databaseben
const { Double } = require('mongodb');
const mongoose= require('mongoose')


const transactionSchema = new  mongoose.Schema({
    Date: {
        type: Date,
        required: true
    },
    _symbol: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
    }],
    // Symbol: {
    //     type: String,
    //     unique: true,
    //     required: true

    // },
    Price: {
        type: Number, // Number ? 
        required: true,
    },
    Piece: {
        type: Number, //quantity= piece
        required: true,
    }
})

const TransactionM = mongoose.model('transactions', transactionSchema) //  '...'-ben: Collection név kell (alséma)
module.exports = TransactionM;