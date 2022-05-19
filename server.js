require('colors');
const express = require('express')
const mongoose = require('mongoose')
const Stock= require('./models/stockModel')
const User= require('./models/userModel')
const TransactionM= require('./models/transactionModel')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')
const authRoutes = require('./routes/authRoutes')
const yahooFinance2 = require('yahoo-finance2').default

//Project: Cluster0
//DB: stocksAtlasOne
//user1
//test1234
//a proba DB: asd123

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
// app.use(express.static('public'))
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))
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


//addfav-hoz lehetne egy routert írni 
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
      res.locals.user.save(); //ide lehet kell egy await mert a mentés később futhat le mint a lekérdezés (lassabban) és így időzítési probléma lehet és ezért nem frissül a gomb ,hogy "add to fav / remove to fav" és így bevárja a mentést 
      // console.log(output);
  }
  
  res.redirect('/addfav/'+symbol)}
// res.redirect('/stocks/'+symbol)}  // "stock" volt az addfav helyett de úgy nem akarta frissíteni az oldalt és ez azért is lett beiktatva hogy kiírja "successful" 
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
// res.redirect('/stocks/'+symbol)}  // "stock" volt az addfav helyett de úgy nem akarta frissíteni az oldalt és ez azért is lett beiktatva hogy kiírja "successful" 
)

  //és hogy frissítse a gombot (amit akkor frissít ha a /stocks/XYZ frissül ,de az vmiért nem akar a res.redirect-tel)
 // ha akarom hogy kiírja hogy "successful" 
app.get('/addfav/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("addfav GET")
  const symbol = req.params.Symbol
  console.log("symbol:",symbol)
  res.render("addfav",{adat: symbol})})
  // res.redirect('/stocks/'+symbol)}) //ezt is megpróbáltam de 20ból 1x talán ha bugos ,így maradok az eredeti verziónál


//teszteléshez ez jó!
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


function DateCreator(StartDate=1) { 
  //system date > 03.27
  //StartDate=1 > 03.28
  //StartDate=0 > 03.27
	var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate()+StartDate),
    year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  stockDate=[year, month, day].join('-');
  return stockDate
}


function Rounder(variable){
  return Math.round(variable*100)/100
}
// const asd =DateCreator(-1)
// console.log(asd)


app.get('/stocks/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("stock site")
  const symbol= req.params.Symbol
  
  console.log("req.params:",req.params)
  console.log("req.params:",symbol)
  console.log("XXXXXXXX")
  // console.log(Symbol)
  // console.log("res.locals: ",res.locals.user)

  
  const yesterdayDate=DateCreator(-1)
  const todayDate=DateCreator(1)
  let eredmeny=await   yahooFinance.historical({
    symbol: symbol,
    from: yesterdayDate,
    to: todayDate,
    period: 'd'
    });

  

    console.log("symbol:",symbol)

    eredmeny[0].low = Rounder(eredmeny[0].low)
    eredmeny[0].high = Rounder(eredmeny[0].high)
    eredmeny[0].open = Rounder(eredmeny[0].open)
    eredmeny[0].close = Rounder(eredmeny[0].close)

    const output = await Stock.findOne({Symbol: symbol})//.limit(1).exec()
    console.log("Stock.FindOne:"+output)
    console.log(typeof output);

    let favVal
    console.log("favs: ", res.locals.user._favourites)
    // console.log("output id: ", output._id)
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

    const queryOptions = { lang: 'en-US', reportsCount: 1, region: 'US' };
    const result = await yahooFinance2.insights(symbol, queryOptions);
    const quote = await yahooFinance2.quote(symbol);
    // const { regularMarketPrice  } = quote;
    const result2 = await yahooFinance2.quoteSummary(symbol)
    console.log({quote,result,result2})

    
    console.log("favVal:",favVal)
    console.log(eredmeny[0])
    console.log(eredmeny[0].date.toString())
    const formattedDate=eredmeny[0].date.toString().slice(0,25)
    eredmeny[0].date=formattedDate
    
    console.log(result2.summaryDetail.exDividendDate)
    try{
      const formattedDate2=result2.summaryDetail.exDividendDate.toString().slice(0,25)
      result2.summaryDetail.exDividendDate=formattedDate2
    }catch{result2.summaryDetail.exDividendDate=""}

    console.log()
    if(output != null){
     res.render('show', {output: output, price: eredmeny[0],favVal: favVal,quote:quote,result:result,result2:result2})
    }else { console.log("BUG")} 
     //a req.params elsőnek megkapta a Symbolt de aztán vmiért frissült és a képet kapta meg és
     // az nem volt benne a DB ben,ami problémát okozott
})

app.get('/ddd', async (req, res) => {
  const queryOptions = { lang: 'en-US', reportsCount: 1, region: 'US' };
  const result = await yahooFinance2.insights('AAPL', queryOptions);
  const quote = await yahooFinance2.quote('AAPL');
  const { regularMarketPrice  } = quote;
  const result2 = await yahooFinance2.quoteSummary("AAPL")
  const quote2 = await yahooFinance.quote("AAPL",["financialData","summaryProfile","earnings"])
  //summyaryprofile : cég infókhoz
  // earnings lehet belőle barchartot csinálni
  //financial data > ebitda , return to assets stb mérleg szerű adatok ,debt, cash , és egyéb kiszámolt dolgok debt to equity stb 
    
  res.send({quote,result,result2,quote2})
  // res.render('dataupload',{results: results})
  
})

app.get('/transactions/add/add_transaction',requireAuth,checkUser, async (req, res) => {
  let results = await Stock.find().sort({Description: 1})
  res.render('transactionAdd',{results: results})
   
})

app.post('/transactions/add/add_transaction', requireAuth,checkUser,async (req, res) => {
  const {date ,name, price,piece} = req.body

  console.log(date,name,price,piece)
  const stockData = await Stock.findOne({Description: name})
  // console.log("stockData kiirva",stockData)
  // console.log("stockdata id ", stockData._id)

  //quantity= piece
  const transaction =  await TransactionM.create({Date:date , _symbol: stockData._id , Price:price, Piece:piece})
  // console.log("transaction kiirva", transaction)
  res.locals.user._transactions.push(transaction._id); //nem push kell hanem add to set hogy többször ne tudja hozzáadni
  await res.locals.user.save(); // hogy bevárja! időzítési probléma ellen 
  
  res.status(201).json({transaction: transaction})


  })

app.get('/transactions', requireAuth, checkUser, async (req, res) => {
    console.log("----------------------------")
    console.log("transactions")

    const prices = [];
    if (res.locals.user._transactions){
      try {
      console.log("res.locals.user._transactions: ",res.locals.user._transactions)
        
        
        for (const i in res.locals.user._transactions) {
          console.log(i)
          console.log("for ciklus")
          console.log(res.locals.user._transactions[i]._symbol[0].Symbol)

          const yesterdayDate=DateCreator(0)
          const todayDate=DateCreator(1)
          
          let letoltottAdatok=await   yahooFinance.historical({
            symbol: res.locals.user._transactions[i]._symbol[0].Symbol,
            from: yesterdayDate,
            to: todayDate,
            period: 'd'
          });
          
          // console.log("letoltottAdatok: ",letoltottAdatok)
          prices.push(Math.round(letoltottAdatok[0].close*100)/100);
          // console.log(typeof(letoltottAdatok[i].close))
          // console.log("prices uj formula: ",parseFloat(prices[i][0].close).toFixed(2))
          console.log("prices: ",prices)
        }
        // const result = res.locals.user._transactions
        
        const eredmenyek=[]
        for (let i = 0; i < prices.length; i++) {
          const transactionPrice= (res.locals.user._transactions[i].Price  * res.locals.user._transactions[i].Piece) 
          const uptoDatePrice = prices[i] * res.locals.user._transactions[i].Piece
          if(transactionPrice > uptoDatePrice) 
          // akkor jó ha uptoDatePrice > transactionPrice ,mert akkor vettünk vmit 100 $ ért és 120$-t ér
          {
            const poziErtek= Math.round( ((uptoDatePrice/transactionPrice)-1)*100*100 ) /100
            eredmenyek.push(poziErtek)
          }else {
            const poziErtek= Math.round( ((uptoDatePrice/transactionPrice)-1)*100*100 ) /100
            eredmenyek.push(poziErtek)
          }
        }



        // muszáj lesz a for ciklst és az ifeket is itt megírni mert a / jel miatt nagyon hosszú számok jönnek ki 120.332442323
        //kiírni azt kéne csak a főképernyőre hogy XY Inc, +304% és ha rámegyünk akkor kidobna hogy mikor vettünk mennyit stb stb
        //most vagy dropdown css kéne a cuccokra vagy pedig egy sima saját oldal a tranzakcióknak
        //tranzakciót törölni is kellene
            //ha töröljük akkor a "transactions" oldalra dobna vissza 

        console.log("eredmenyek ", eredmenyek)
        res.render('transactionsList2', {transactions: res.locals.user._transactions,prices:prices,result: eredmenyek})

        // if ( (result.Price  * result.Piece) > (prices[db][0].close * result.Piece) ){pass}



      }
      catch (err) { console.log(err) }
    }

     
          

  })
  app.get('/transaction3', async (req, res) => {res.render('transactionsList5')})
  app.get('/transaction2', async (req, res) => {res.render('transactionsList3')})


  app.get('/transactions/:_id', requireAuth,checkUser, async (req, res) => {
    console.log("----------------------------")
    console.log("transcation egyedi site")
    const id= req.params._id
    
    console.log("req.params:",req.params)
    console.log("req.params:",id)
    console.log("req.res.locals.user._transactions:",res.locals.user._transactions)
    
    console.log("XXXXXXXX")
  
    
    const yesterdayDate=DateCreator(0)
    const todayDate=DateCreator(1)
    const uniqueTransaction = await TransactionM.findOne({_id: mongoose.Types.ObjectId(id)})
    console.log("uniqueTransaction:",uniqueTransaction)
    const uniqueTransaction_StockData= await Stock.findOne({_id: mongoose.Types.ObjectId(uniqueTransaction._symbol[0])})
    console.log("uniqueTransaction_StockData:",uniqueTransaction_StockData)
    
    
    let letoltottAdatok=await   yahooFinance.historical({
      symbol: uniqueTransaction_StockData.Symbol,
      from: yesterdayDate,
      to: todayDate,
      period: 'd'
    });
    const prices= Math.round(letoltottAdatok[0].close*100)/100

    const transactionPrice= (uniqueTransaction.Price  * uniqueTransaction.Piece) 
    const uptoDatePrice = prices * uniqueTransaction.Piece
    const formattedDate=uniqueTransaction.Date.toString().slice(0,15)
    console.log("formattedDate:",formattedDate)

    let eredmenyek=0
    if(transactionPrice > uptoDatePrice) 
    // akkor jó ha uptoDatePrice > transactionPrice ,mert akkor vettünk vmit 100 $ ért és 120$-t ér
    {
      const poziErtek= Math.round( ((uptoDatePrice/transactionPrice)-1)*100*100 ) /100
      eredmenyek= poziErtek
    }else {
      const poziErtek= Math.round( ((uptoDatePrice/transactionPrice)-1)*100*100 ) /100
      eredmenyek= poziErtek
    }
    
    res.render('showTransaction', {transactions: uniqueTransaction,stockData:uniqueTransaction_StockData,prices:prices,result: eredmenyek,formattedDate:formattedDate})

  })

app.post('/transactions/del/:_id', requireAuth,checkUser, async (req, res) => {
  try{
    console.log(req.params._id)
    await res.locals.user._transactions.pull(req.params._id);
    await res.locals.user.save();
    // res.status(201).json({transaction: req.params._id})
    res.redirect("/transactions")
  }  catch{
    console.log("ERROR")}
  })
  app.get('/transactions4',  async (req, res) => {
    console.log("----------------------------")
    const letoltottAdatok=await   yahooFinance.historical({
      symbol: "AAPL",
      from: "2022-03-15",
      to: "2022-04-15",
      period: 'd'
    });
    
    // console.log(letoltottAdatok)
    const dates= []
    const closingPrices=[]
    for (let i = 0; i < letoltottAdatok.length; i++) {
    
      let formattedDate=letoltottAdatok[i].date.toISOString().slice(0,10)
      // .toString().slice(0,15).slice(4,15)
      dates.push(formattedDate)
      Math.round(letoltottAdatok[0].close*100)/100
      closingPrices.push(Math.round(letoltottAdatok[i].close*100)/100)
    }
    console.log(dates)
    console.log(closingPrices)
    res.render('transactionsList4', {dates: dates,closingPrices:closingPrices})
  })

app.get('/datas', async (req, res) => {
console.log("----------------------------")  

  const symbol= "AAPL"
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
    to: stockDate,
    period: '1m'
    });
console.log(eredmeny)
console.log(eredmeny[0])
console.log(eredmeny[eredmeny.length-1])
// res.send(eredmeny)

res.render('datas', {result: eredmeny[0]})


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

  searchOptions.Description = new RegExp(req.query.Description, 'i') //case insesitive
  // console.log(searchOptions.Description)
  // console.log(searchOptions)
  let result = await Stock.find(searchOptions)//{Symbol: searchOptions})
  // console.log(result)
  res.render('search', {result: result, searchOptions: req.query})
}
else {
  // Stock.find({Symbol:'TSLA'})
  // .then((result) => {

  //   res.render('search', {result: result, searchOptions: req.query})
  // })
  // .catch((err) => {
  //       console.log(err)
  //     })
  //     }
  res.render('search', {result: [], searchOptions: req.query}) }
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