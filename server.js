require('colors');
const express = require('express')
const mongoose = require('mongoose')
const Stock= require('./models/stockModel')
const User= require('./models/userModel')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

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

// app.get('*', checkUser) //ez kéne ha injectelni akarjuk a user datat az összes viewba

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
  console.log("----------------------------")
  console.log("stocks")
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

app.post('/addfav/add/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("addfav add POST")
  // console.log(req.body)
  // const Symbol = req.body.Symbol
  console.log(req.params)
  const symbol = req.params.Symbol;
  console.log("POST")
  console.log(symbol)
  const output = await Stock.findOne({Symbol: symbol})
  console.log(output)
  if (output){

      res.locals.user._favourites.addToSet(output._id);
      res.locals.user.save();
      // console.log(output);
  }
res.redirect('/addfav/'+symbol)}
)
app.post('/addfav/del/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("addfav del POST")
  // console.log(req.body)
  // const Symbol = req.body.Symbol
  console.log(req.params)
  const symbol = req.params.Symbol;
  console.log("POST")
  console.log(symbol)
  const output = await Stock.findOne({Symbol: symbol})
  console.log(output)
  if (output){

      res.locals.user._favourites.pull(output._id);
      res.locals.user.save();
      // console.log(output);
  }
  console.log("res.locals.user._favourites: ", res.locals.user._favourites)
  console.log("res.locals.user: ", res.locals.user)
res.redirect('/addfav/'+symbol)}

)


app.get('/addfav/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("addfav GET")
  const symbol = req.params.Symbol
  console.log("symbol:",symbol)
  res.render("addfav",{adat: symbol})})

app.get('/sad/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")  
  const symbol = req.params.Symbol;
    console.log("req.body:")
    console.log(req.body)
    console.log("ADDFAV")
    console.log(symbol)
    const output = await Stock.findOne({Symbol: symbol})
    if (output){

        res.locals.user._favourites.addToSet(output._id); //nem push kell hanem add to set hogy többször ne tudja hozzáadni
        res.locals.user.save();
        console.log(output)
    }
    console.log(req.params)
    console.log(req.params.Symbol)
    // res.render('addfav', {output: symbol})
    
});
app.get('/stocks/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("stock site")
  const symbol= req.params.Symbol
  console.log("req.params:",req.params)
  console.log("req.params:",symbol)
  console.log("XXXXXXXX")
  // console.log(Symbol)
  // console.log("res.locals: ",res.locals.user)

  
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
  console.log("symbol:",symbol)
    const output = await Stock.findOne({Symbol: symbol})//.limit(1).exec()
    console.log("Stock.FindOne:"+output)
    console.log(typeof output);

    let favVal
    console.log("favs: ", res.locals.user._favourites)
    console.log("output id: ", output._id)
    console.log("res.local.user._favourites id: " ,res.locals.user._favourites)
    for (var i = 0; i < res.locals.user._favourites.length; i++) {
      console.log("res.local.user._favourites id: " ,res.locals.user._favourites[i]._id)
      let srch=res.locals.user._favourites[i]._id.toString().localeCompare(output._id)
      if (srch ===0){
        favVal=1;
        console.log("favVal:",favVal)
        break;
      }else{
      favVal=0
      console.log("favVal:",favVal)}
    }

    // res.locals.user._favourites.forEach(element => {
    //   console.log("element: ",element)

    //   if( output._id === element._id ){
    //     favVal=1;
    //     console.log("favVal:",favVal)
    //   }else{
    //     console.log("favVal:",favVal)
    //     favVal=0
    //   }});
    
    //  console.log("true or false: ",res.locals.user._favourites.includes(output))
    
    // if(res.locals.user._favourites._id.includes(output._id)){
    //   favVal=0
    // }else{
    //   favVal=1
    // }
    console.log("favVal:",favVal)
    // });

    console.log()
    if(output != null){
     res.render('show', {output: output, price: eredmeny[0],favVal: favVal})
    }else { console.log("BUG")} 
     //a req.params elsőnek megkapta a Symbolt de aztán vmiért frissült és a képet kapta meg és
     // az nem volt benne a DB ben,ami problémát okozott
})


 app.get('/profile',  checkUser, (req, res) => {
//   //Stock.findOne({Symbol: 'AAPL'}) ezzel kell majd lekérdezni!
  
//    Stock.find()
//   .then((result) => {
  res.render('profile')
//     res.render('fav', {result: result})
//   })
//   .catch((err) => {
//         console.log(err)
//       })
 }
 )
//
app.get('/favourites', requireAuth, checkUser, (req, res) => {
  console.log("----------------------------")
  console.log("favourites")
  var valFavs=0;
  console.log("res.locals.user._favourites: ",res.locals.user._favourites)
  try {const favs = res.locals.user._favourites ;
    if(res.locals.user._favourites!= null)
    {
      valFavs=favs
    };}
  catch (err) {console.log(err)}
  
  // const output = await Stock.findById({_id: favs})
  res.render('fav', {result: valFavs});
})

app.get('/search', requireAuth, async (req, res) => {
  console.log("----------------------------")
  console.log("search")
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