require('colors');
const express = require('express')
const mongoose = require('mongoose')
const Stock= require('./models/stockModel')
const User= require('./models/userModel')
const cookieParser = require('cookie-parser')
const {requireAuth} = require('./middleware/authMiddleware')

const authRoutes = require('./routes/authRoutes')

//Project: Cluster0
//DB: stocksAtlasOne
//user1
//test1234
//proba DB: asd123

//ide a DB nevét kell írni
const dbURI="mongodb+srv://user1:test1234@cluster0.vaq5p.mongodb.net/stocksAtlasOne?retryWrites=true&w=majority"
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




//middleware: publicban elhelyezett képek megjelenítéséhez,css ekhez szükséges
app.use(express.static('public'))
app.use(express.json()) //postman teszthez ,(backend teszt)

app.use(cookieParser())

//view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true })) //for accepting form data
app.get('/',  requireAuth , (req, res) => {
  // res.render('allStocks.ejs',{ stocks: stocks })
  // ,console.log(stocks.Symbol)
  res.redirect('/favourites')
})
//

//Teszt- valamiért az asd123on belül egy 'stocks' collectiont létrehoz ,nem igazán értem miért és hogy honnan jött ez a név
//annyi biztos h  nem a const [stock] miatt= new Stock miatt; a  new [Stock] miatt lesz stocks,(?)
//nem is a const Stock= require miatt (modul exportálás) van ez.
//StockModelben lévő string miatt lesz az, 'const Stock = mongoose.model(['Stock'], stockSchema)' ,ennek a collection nevének kell lennie
// és akkor oda rakja be ténylegesen,nem kreál másikat
//akkor kerül beírásra ha megnyitjuk az oldalt!!!




// app.get('/blog',  (req, res) => {
//   const stock = new Stock({
//     Symbol: 'Proba2222',
//     Description: 'Proba2222'
//   });
//   stock.save()
//   .then((result) => {
//     res.send(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// })

// app.get('/blog',  (req, res) => {
//   const stock = new Stock({
//     Symbol: 'P',
//     Description: 'P'
//   });
//   stock.save()
//   .then((result) => {
//     res.send(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// })

//ez megjeleníti az összes stockot, mongodb-be betoltam a nasdaq.txt (csvben)
app.get('/db',  (req, res) => {
  //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  
  Stock.find()
  .then((results) => {
    res.send(results)
  })
  .catch((err) => {
        console.log(err)
      })
}
)

app.get('/stocks', requireAuth, (req, res) => {
  //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  
  Stock.find()
  .then((result) => {

    res.render('allStocks', {result: result})
  })
  .catch((err) => {
        console.log(err)
      })
}
)

var util = require('util');
var yahooFinance = require('yahoo-finance');


app.get('/stocks/:Symbol', requireAuth, async (req, res) => {
  const symbol= req.params.Symbol
  // console.log(Symbol)
  
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate()+1),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

  stockDate=[year, month, day].join('-')
  let eredmeny=await   yahooFinance.historical({
    symbol: symbol,
    from: '2012-01-01',
    to: stockDate,//'2021-10-16',
    period: 'd'
    });
  //   , function (quotes) {
  //     eredmeny=quotes
  //   }).then(eredmeny=quotes)
  // //
  //console.log( JSON.stringify(eredmeny[0]))
  Stock.findOne({Symbol: symbol})
  .then(output => {
    console.log("out"+output)
    console.log(typeof output);
    console.log()
     res.render('show', {output: output, price: eredmeny[0]})
  })//show: view, amit megjelenítsen oldal
  .catch((err) => {
    console.log(err)
  })

})


 app.get('/asd',  (req, res) => {
//   //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  
//    Stock.find()
//   .then((result) => {
  res.render('asd')
//     res.render('fav', {result: result})
//   })
//   .catch((err) => {
//         console.log(err)
//       })
 }
 )
//
app.get('/favourites', requireAuth, (req, res) => {
  //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  
   Stock.find()
  .then((result) => {

    res.render('fav', {result: result})
  })
  .catch((err) => {
        console.log(err)
      })
}
)

app.get('/search', requireAuth, async (req, res) => {
  
  //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  //var data= req.query
  //res.render('proba', {kuki: data})
  let searchOptions={}
  
  if ((req.query.Symbol != null && req.query.Symbol != "")){
    // console.log(req.query)
    // console.log(req.query.Symbol)
    //searchOptions.ticker = new RegExp(req.query.ticker, 'i') //i : case insensitive
    searchOptions.Symbol = req.query.Symbol.toUpperCase()
  
  
    // console.log(searchOptions.Symbol)
    // console.log(searchOptions)
    let result = await Stock.find(searchOptions)//{Symbol: searchOptions})
    // console.log(result)
    res.render('search', {result: result, searchOptions: req.query})
  
  // .catch((err) => {
  //       console.log(err)
  //     })
}
else if (req.query.Description != null && req.query.Description != "") {

  searchOptions.Description = new RegExp(req.query.Description, 'i')
  // console.log(searchOptions.Description)
  // console.log(searchOptions)
  let result = await Stock.find(searchOptions)//{Symbol: searchOptions})
  // console.log(result)
  res.render('search', {result: result, searchOptions: req.query})
}
else {
  Stock.find({Symbol:'TSLA'})
  .then((result) => {

    res.render('search', {result: result, searchOptions: req.query})
  })
  .catch((err) => {
        console.log(err)
      })
      }
}
)
  

app.use(authRoutes)
// yahooFinance.historical({
//   symbol: Symbol,
//   from: '2012-01-01',
//   to: '2021-10-21',
//   period: 'd'
// }).then(quotes=>{res.render('show', {stocks: Symbol, title: 'asd'})})

//cookie beállítás
  // app.get('/set-cookies', (req,res) => {
  //   //cookie vizsgálat > jobb klikk vizsgálat> konzol> document.cookie , cokkies pedig a 'Tároló' /'applications' részen
  //   //to deal with cookies > cookie-parser
  
  //   // res.setHeader('Set-Cookie', 'newUser=True')
  //   // a .setHeader-es és a .cookie-s ugynazt csinálja de később a .cookiesat könnyebb lesz accesselni
  //   res.cookie('newUser',false)
  //   // res.cookie('isAdmin', false, {maxAge: 1000*60*60*24}) //maxAge: a cookie expires ideje: 1000 miliszekundum*60 sec *60 perc *24 óra= 1 nap miliszekundumban
  //   // res.cookie('isAdmin', false, {maxAge: 1000*60*60*24,secure: true}) //secure: a cookie csak akkor kerül elküldésre ha https connectionünk van
  //   res.cookie('isAdmin', true, {maxAge: 1000*60*60*24,httpOnly: true}) //a vizsgálat/konzol részen nem érhető el az értéke a cookienak,a frontenden nem érhető el,és csak http protokollon lehet átküldeni
  //   res.send('you got the cookies')


  // })


  // app.get('/read-cookies', (req,res) => {
  //   //cookies-parser package segítségével lehet a req,res en keresztül elérni a cookiekat
  //   const cookies  = req.cookies
  //   console.log(cookies)
  //   res.json(cookies)
  // })

//dfdfdf

// fdfghgd



//footer
//dátum
// stock oldalon a hibák javítása
//profil view
//login és register view