
var util = require('util');
require('colors');
var yahooFinance = require('yahoo-finance');



//from fileRead.js:
var fs = require('fs');

try {  
    
        var data = fs.readFileSync('NASDAQ.txt', 'utf8');
    // console.log(data.toString()); 
       
} catch(e) {
    console.log('Error:', e.stack);
}
// module.exports= ready

//https://stackoverflow.com/questions/36120265/how-to-convert-text-file-to-json-in-javascript
var cells = data.split('\n').map(function (el) { return el.replace(/\r/,'').split(/\t/) });
var headings = cells.shift();
var out = cells.map(function (el) {
  var obj = {};
  for (var i = 0, l = el.length; i < l; i++) {
    obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
  }
  return obj;
});


var json = JSON.stringify(out);
// console.log(json)
// console.log(JSON.stringify(out, null, 2));



const express = require('express')
const mongoose = require('mongoose')
const Stock= require('./models/stockModel')
const ready = require('./fileRead') // sima 'fileRead' hibát ad 
//ez nem akar működni xdd

//stocksAtlasOne
const dbURI="mongodb+srv://user1:test1234@cluster0.vaq5p.mongodb.net/asd123?retryWrites=true&w=majority"
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
                  console.log("connected to db"),
                  app.listen(3000)
                }) 
.catch((error) => console.log(error)) //.then mert async function, catchel a hibát írjuk ki.

const methodOverride = require('method-override');
const { render } = require('ejs');
const app = express()

console.log()


const stocks1=JSON.parse(json)


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true })) //for accepting form data
app.get('/',  (req, res) => {
  res.render('allStocks.ejs',{ stocks1: stocks })
  ,console.log(stocks1.Symbol)
})
//
app.get(app.get('/blog',  (req, res) => {
  const asd123 = new Stock({
    Symbol: 'Proba22',
    Description: 'Proba22'
  });
  asd123.save()
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err)
  })

}))

//még nem működik
app.get('/show/:stocks1.Symbol',  (req, res) => {
  console.log("asd")
  const Symbol= req.params.stocks1.Symbol
  console.log(Symbol)
  
// yahooFinance.historical({
//   symbol: Symbol,
//   from: '2012-01-01',
//   to: '2021-10-21',
//   period: 'd'
// }).then(quotes=>{res.render('show', {stocks: Symbol, title: 'asd'})})

  
})
//dfdfdf

// fdfghgd
