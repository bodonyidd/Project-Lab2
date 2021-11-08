//yahoo finance api, innen nem tudom kiszedni a kiadott jsont


var util = require('util');

require('colors');

var yahooFinance = require('yahoo-finance');

var SYMBOL = 'AAPL';

yahooFinance.historical({
  symbol: SYMBOL,
  from: '2012-01-01',
  to: '2019-12-31',
  period: 'd'
}, function (err, quotes) {
  if (err) { throw err; }
  console.log(util.format(
    '=== %s (%d) ===',
    SYMBOL,
    quotes.length
  ).cyan);
  if (quotes[0]) {
    console.log(
      '%s\n...\n%s',
      JSON.stringify(quotes[0], null, 2),
      JSON.stringify(quotes[quotes.length - 1], null, 2)
    );
  } else {
    console.log('N/A');
  }
});



var util = require('util');
const { historical } = require('yahoo-finance');
require('colors');
var util = require('util');
var yahooFinance = require('yahoo-finance');
var SYMBOL = 'AAPL';


const express = require('express')
const app = express()

var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate()+1),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;
//console.log( [year, month, day].join('-'))) //https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
stockDate=[year, month, day].join('-')
// console.log(stockDate)

//app.set('view engine', 'ejs')

app.get('/',  async(req, res) => {
    //res.render('showCopy.ejs',{ adat: quotes[0] })
    res.send(await yahooFinance.historical({
    symbol: SYMBOL,
    from: '2012-01-01',
    to: stockDate,//'2021-10-16',
    period: 'd'
    }, function (quotes) {
        console.log(quotes[0])
        //res.send(quotes[0])
    }))  

  

})



app.listen(3000)