// var tulind = require('tulind');
// console.log("Tulip Indicators version is:");
// console.log(tulind.version);
// console.log(tulind.indicators);


// var close = [4,5,6,6,6,5,5,5,6,4];
// tulind.indicators.sma.indicator([close], [3], function(err, results) {
//     console.log("Result of sma is:");
//     console.log(results[0]);
//   });

const tf =require('@tensorflow/tfjs')
const express = require('express')
const methodOverride = require('method-override');
const { render } = require('ejs');
const app = express()
app.listen(3000)

console.log()
const path = require('path')
const fs = require('fs');

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json()) //postman teszthez ,(backend teszt)

// app.use(cookieParser())

// app.get('*', checkUser) //ez kéne ha injectelni akarjuk a user datat az összes viewba

//view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true })) //for accepting form data
app.get('/',   (req, res) => {

let rawdata = fs.readFileSync('public/NonMaxSuppression.json');
let student = JSON.parse(rawdata);
console.log(student);
  // res.render('allStocks.ejs',{ stocks: stocks })
  // ,console.log(stocks.Symbol)
// console.log(tf.version)

  res.render('tf',{std:student})
})
