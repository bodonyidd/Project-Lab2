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
// const mongoose = require('mongoose')

const ready = require('./fileRead') // sima 'fileRead' hibát ad 
//ez nem akar működni xdd



const methodOverride = require('method-override')
const app = express()

console.log()


const stocks=JSON.parse(json)


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true })) //for accepting form data
app.get('/',  (req, res) => {
  res.render('allStocks.ejs',{ stocks: stocks })
})
//


//még nem működik
app.get('/articles/show/:stocks.Symbol}',  (req, res) => {
  res.send(req.Symbol)
})
//dfdf

// fdfghgd
app.listen(3000)