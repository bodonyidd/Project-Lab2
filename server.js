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
const SMA = require('technicalindicators').SMA;
var util = require('util');
var yahooFinance = require('yahoo-finance');
var tulind = require('tulind'); //to RSI
const tf = require('@tensorflow/tfjs-node')
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

//addfav-hoz lehetne egy routert írni 
app.post('/addfav/add/:Symbol', requireAuth,checkUser, async (req, res) => {
  console.log("----------------------------")
  console.log("addfav add POST")
  // // console.log(req.body)
  // // const Symbol = req.body.Symbol
  // console.log(req.params)
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


function DateCreator(StartDate=0) { 
  //system date > 03.27
  //StartDate=1 > 03.28
  //StartDate=0 > 03.27
  ////////////////////////
  // 2022.09.25 ekkor 
  // const yesterdayDate=DateCreator(-1)
  // const todayDate=DateCreator(0)
  ///////////////////
  
var current_date = new Date ()
var created_old_date = new Date (  
  current_date.getFullYear(),  
  current_date.getMonth(),  
  (current_date.getDate()+StartDate)  
)
let raw_date =created_old_date.toLocaleString()
let formatted_date=""
for (let i = 0; i < 4; i++) {
formatted_date=formatted_date+raw_date[i]
}
formatted_date=formatted_date+"-"
for (let i = 6; i < 8; i++) {
formatted_date=formatted_date+raw_date[i]
}
formatted_date=formatted_date+"-"
for (let i = 10; i < 12; i++) {
formatted_date=formatted_date+raw_date[i]
}
console.log(raw_date)
console.log(formatted_date)

	// var d = new Date(),
  // month = '' + (d.getMonth() + 1),
  // temp_day=d.getDate()
  // day = '' + (d.setDate(d.getDate()+StartDate)),
  // year = d.getFullYear();
  
  // day ='' +d.getDate()
  // console.log("d.getDate()",d.getDate())

  // if (month.length < 2) 
  //     month = '0' + month;
  // if (day.length < 2) 
  //     day = '0' + day;

  // stockDate=[year, month, day].join('-');
  return formatted_date
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
  
  
  
  const yesterdayDate=DateCreator(-5)
  const todayDate=DateCreator(0)
  console.log("yesterdayDate,todayDate: ",yesterdayDate,todayDate)
  // var queryOptions0 = { period1: yesterdayDate,period2: todayDate};
  // const eredmeny = await yahooFinance2.historical(symbol, queryOptions0);
  let eredmeny= await yahooFinance.historical({
    symbol: symbol,
    from: yesterdayDate,
    to: todayDate,
    period: 'd'
    });
    console.log("eredmeny:",eredmeny[0])

  

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
    let result = await yahooFinance2.insights(symbol, queryOptions);
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
    
    if ('companySnapshot' in result){
    
    }
    else{
      result.companySnapshot = ""
    }
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

app.get('/dddd',requireAuth,checkUser, async (req, res) => {
  const query = 'TSLA';
  const queryOptions = { period1: '2021-02-01',period2: '2022-02-01',};
  const letoltottAdatok = await yahooFinance2.historical(query, queryOptions);
  res.send(letoltottAdatok)
	// [{"date":"2021-02-01T00:00:00.000Z","open":271.429993,"high":280.666656,
  // "low":265.186676,"close":279.936676,"adjClose":279.936676,"volume":76174200},
  // 0	
  // date	"2021-02-01T00:00:00.000Z"
  // open	271.429993
  // high	280.666656
  // low	265.186676
  // close	279.936676
  // adjClose	279.936676
  // volume	76174200
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

          const yesterdayDate=DateCreator(-1)
          const todayDate=DateCreator(0)
          // [{"date":"2021-02-01T00:00:00.000Z","open":271.429993,"high":280.666656,
          // "low":265.186676,"close":279.936676,"adjClose":279.936676,"volume":76174200},
          // 0	
          // date	"2021-02-01T00:00:00.000Z"
          // open	271.429993
          // high	280.666656
          // low	265.186676
          // close	279.936676
          // adjClose	279.936676
          // volume	76174200
          console.log("yesterdayDate: ",yesterdayDate)
          console.log("todayDate: ",todayDate)
          let query = res.locals.user._transactions[i]._symbol[0].Symbol;
          // let queryOptions = { period1: yesterdayDate,period2: todayDate};
          // let letoltottAdatok = await yahooFinance2.historical(query, queryOptions);
          let letoltottAdatok=await yahooFinance.historical({
            symbol: res.locals.user._transactions[i]._symbol[0].Symbol,
            from: yesterdayDate,
            to: todayDate,
            period: 'd'
          });
          console.log("letoltottAdatok: ",letoltottAdatok)
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
  app.get('/transaction5', async (req, res) => {res.render('transactionsList5')})
  app.get('/transaction2', async (req, res) => {res.render('transactionsList3')})

  app.get('/qwerty', requireAuth,checkUser, async (req, res) => {
    const query = 'TSLA';
    const queryOptions = { period1: '2021-02-01',period2: '2022-02-01',};
    const letoltottAdatok = await yahooFinance2.historical(query, queryOptions);
    console.log("req.res.locals.user._transactions:",res.locals.user._transactions)
  })

  app.get('/transactions/:_id', requireAuth,checkUser, async (req, res) => {
    console.log("----------------------------")
    console.log("transcation egyedi site")
    const id= req.params._id
    
    console.log("req.params:",req.params)
    console.log("req.params:",id)
    console.log("req.res.locals.user._transactions:",res.locals.user._transactions)
    
    console.log("XXXXXXXX")
  
    
    const yesterdayDate=DateCreator(-1)
    const todayDate=DateCreator(0)
    console.log("yesterdayDate:",yesterdayDate)
    console.log("todayDate:",todayDate)
    const uniqueTransaction = await TransactionM.findOne({_id: mongoose.Types.ObjectId(id)})
    console.log("uniqueTransaction:",uniqueTransaction)
    const uniqueTransaction_StockData= await Stock.findOne({_id: mongoose.Types.ObjectId(uniqueTransaction._symbol[0])})
    console.log("uniqueTransaction_StockData:",uniqueTransaction_StockData)
    
    const query = uniqueTransaction_StockData.Symbol;
    const queryOptions = { period1: yesterdayDate,period2: todayDate,};
    const letoltottAdatok = await yahooFinance2.historical(query, queryOptions);

    // let letoltottAdatok=await   yahooFinance.historical({
    //   symbol: uniqueTransaction_StockData.Symbol,
    //   from: yesterdayDate,
    //   to: todayDate,
    //   period: 'd'
    // });
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

  var curday = function(sp){
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return (yyyy+sp+mm+sp+dd);
    };
  

  app.get('/charts/:Symbol', requireAuth,checkUser, async (req, res) => {
    console.log("----------------------------")
    console.log("stock'a chart site")
    const symbol= req.params.Symbol
    const  queriedStock = await Stock.findOne({Symbol: symbol})
    
    let searchOptions={}
    
    var todaysDate=curday('-')

    if (req.query.fromDate){
      searchOptions.fromDate=req.query.fromDate
      searchOptions.toDate=req.query.toDate
    }
    else{
      searchOptions.fromDate="2010-06-06"
      searchOptions.toDate=todaysDate
    }

    if (req.query.freqDropdown){
      searchOptions.freqDropdown=req.query.freqDropdown
    }
    else{
      searchOptions.freqDropdown="d"
    }

    if(req.query.dataDropdown)
    {
      searchOptions.dataDropdown=req.query.dataDropdown
    }
    else{searchOptions.dataDropdown="close"}

    if(req.query.chartTypeDropdown){
      searchOptions.chartTypeDropdown=req.query.chartTypeDropdown
    }else{
      searchOptions.chartTypeDropdown="scatter"
    }
    console.log("searchOptions: ",searchOptions)
    var letoltottAdatok = await yahooFinance.historical({
      symbol: symbol,
      from: searchOptions.fromDate,
      to: searchOptions.toDate,
      period: searchOptions.freqDropdown
    });

    //yahoofinance2
  //   const queryOptions = { period1: '2021-05-08',period2: '2022-05-08',interval:"5d"}
  // const result = await yahooFinance._chart("TSLA", queryOptions,
  // );
 
  
    let dates= []
    console.log()
    let allChartData=[]
    let low=[]
    let high=[]
    let open=[]
    let close=[]
    
    for (let i = 0; i < letoltottAdatok.length; i++) {
      let formattedDate=letoltottAdatok[i].date.toISOString().slice(0,10)
      // .toString().slice(0,15).slice(4,15)
      dates.push(formattedDate)
      if (searchOptions.chartTypeDropdown=="scatter"){
      if (searchOptions.dataDropdown=='volume'){
        allChartData.push(letoltottAdatok[i].volume)
      }
      else if(searchOptions.dataDropdown=='open'){
        // Math.round(letoltottAdatok[0].open*100)/100
        allChartData.push(Rounder(letoltottAdatok[i].open))
      }
      else if(searchOptions.dataDropdown=='high'){
        Math.round(letoltottAdatok[0].high*100)/100
        allChartData.push(Rounder(letoltottAdatok[i].high))
      }
      else if(searchOptions.dataDropdown=='low'){
        Math.round(letoltottAdatok[0].low*100)/100
        allChartData.push(Rounder(letoltottAdatok[i].low))
      }
      else{
      Math.round(letoltottAdatok[0].close*100)/100
      allChartData.push(Rounder(letoltottAdatok[i].close*100)/100)
  }}
      else{
        Math.round(letoltottAdatok[0].low*100)/100
        low.push(Rounder(letoltottAdatok[i].low))

        Math.round(letoltottAdatok[0].high*100)/100
        high.push(Rounder(letoltottAdatok[i].high))

        Math.round(letoltottAdatok[0].open*100)/100
        open.push(Rounder(letoltottAdatok[i].open))

        Math.round(letoltottAdatok[0].close*100)/100
        close.push(Rounder(letoltottAdatok[i].close))

      }
    }
    console.log(searchOptions)
    
    dates = dates.reverse();
    allChartData=allChartData.reverse();
    low= low.reverse();
    high= high.reverse();
    open= open.reverse();
    close= close.reverse();
   
    
  
    // console.log(dates)
    // console.log(allChartData)
    console.log(dates.length)
    console.log("chartadatok:",allChartData.length)
    console.log(allChartData[3000])

    console.log(todaysDate)
    let chartData=[]
    chartData=allChartData
    console.log(chartData.length)
    if (low.length<1){
      low=0
      
      high=0
      open= 0
      close=0
    }
    // console.log(req)
    // MA
    // console.log("XASASAASAS",req.query)
    // to SMA#1
    var mov_avg_res=[]
    searchOptions.sma=req.query.sma
    if(searchOptions.sma>10000)
    {searchOptions.sma=''}

    if(searchOptions.sma>0)
    {
      mov_avg_res=new Array(searchOptions.sma-1).fill(null);
      var temp_mov_avg=[]
      if (searchOptions.chartTypeDropdown=="candlestick"){
        temp_mov_avg = SMA.calculate({period: searchOptions.sma, values: close});
        
      }else{
        temp_mov_avg = SMA.calculate({period: searchOptions.sma, values: allChartData});

      }
      mov_avg_res= mov_avg_res.concat(temp_mov_avg)
    console.log("mov_avg_res",mov_avg_res.length)
    console.log("mov_avg_res",mov_avg_res.length)
  }
  
  // to SMA#2
  var mov_avg_res_2=[]
  searchOptions.sma_2=req.query.sma_2
  if(searchOptions.sma_2>10000)
  {searchOptions.sma_2=''}

  if(searchOptions.sma_2>0)
  {
    mov_avg_res_2=new Array(searchOptions.sma_2-1).fill(null);
    var temp_mov_avg_2=[]
    if (searchOptions.chartTypeDropdown=="candlestick"){
      temp_mov_avg_2 = SMA.calculate({period: searchOptions.sma_2, values: close});
      
    }else{
      temp_mov_avg_2 = SMA.calculate({period: searchOptions.sma_2, values: allChartData});

    }
    mov_avg_res_2= mov_avg_res_2.concat(temp_mov_avg_2)
  console.log("mov_avg_res",mov_avg_res_2.length)
}
var rsi_data=0;
var temp_rsi=0;

if (searchOptions.chartTypeDropdown=="candlestick"){
  rsi_data=await tulind.indicators.rsi.indicator([close], [14] ) 
  temp_rsi=new Array(parseInt(close.length)-parseInt(rsi_data[0].length)).fill(null)
}else{
  rsi_data= await tulind.indicators.rsi.indicator([allChartData], [14])
  temp_rsi=new Array(parseInt(allChartData.length)-parseInt(rsi_data[0].length)).fill(null)
}

var rsi=[]
rsi=temp_rsi.concat(rsi_data[0])
console.log("allChartData.length-rsi_data.length",parseInt(allChartData.length)-parseInt(rsi_data[0].length))
console.log("rsi",rsi.length)
console.log("rsi",rsi[0])
console.log("rsi",rsi[1])
console.log("rsi",rsi[13])
console.log("rsi",rsi[14])


// tulind.indicators.rsi.indicator([allChartData], [14], function(err, results) {
//   // console.log("Result of rsi is:");
//   // console.log(results[0]);
// });
// qwer = RSI.calculate({period: 14, values: close});

// var inputRSI = {
//   values : close,
//   period : 14
// };
// qwer=RSI.calculate(inputRSI)
// console.log(qwer)
res.render('transactionsList4', {RSI:rsi,searchOptions:searchOptions,todaysDate:todaysDate,stockData:queriedStock,dates: dates,chartData:allChartData,mov_avg_data:mov_avg_res,mov_avg_data_2:mov_avg_res_2,low:low,high:high,open:open,close:close})
  
})
    
  //   const yesterdayDate=DateCreator(-1)
  //   const todayDate=DateCreator(1)
  
    
  
  //     console.log("symbol:",symbol)
  
  //     eredmeny[0].low = Rounder(eredmeny[0].low)
  //     eredmeny[0].high = Rounder(eredmeny[0].high)
  //     eredmeny[0].open = Rounder(eredmeny[0].open)
  //     eredmeny[0].close = Rounder(eredmeny[0].close)
  
  //     const output = await Stock.findOne({Symbol: symbol})//.limit(1).exec()
  // })

  app.get('/tulip',  async (req, res) => {
    
    var tulind = require('tulind');
    console.log("Tulip Indicators version is:");
    console.log(tulind.version);
    console.log(tulind.indicators);
    
    var close = [4,5,6,6,6,5,5,5,6,4];
    tulind.indicators.rsi.indicator([close], [14], function(err, results) {
        console.log("Result of rsi is:");
        console.log(results[0]);
      });
    res.render('probachars',{asd:tulind.indicators})
  })
//   var tulind = require('tulind');
// console.log("Tulip Indicators version is:");
// console.log(tulind.version);


// var close = [4,5,6,6,6,5,5,5,6,4];
// tulind.indicators.sma.indicator([close], [3], function(err, results) {
//     console.log("Result of sma is:");
//     console.log(results[0]);
//   });
  app.get('/transactions4',  async (req, res) => {
    
    //Itt folytatni majd egy gombot tenni az oldalra
    //hogy default values h automatice beálltsa az időket
    //if datatype=='volume' {.....automatice line diagram
    //  ide lehet kéne egy tooltip h ez csak line diagramban jó}
    //meg lehet h ezt is kezelni kéne beszarik az api olykor, 
    // hogy DateCreator(0),DateCreator(1) a yesterday-today date de 0:00 után,
    //  gondolom emrt nincs új adat elbaszódik és a DateCreator(-2),DateCreator(-1) kombóval möxik csak
    
    res.render('probachars')
  })

  app.get('/tf',  async (req, res) => {
    res.render('tf')
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
    period: 'm'
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

  app.get('/teaching', async(req, res) => {
    
    // async function get_stock_data(){
      let eredmeny_not_reversed= await yahooFinance.historical({
        symbol: "AAPL",
        from: '2002-01-01',
          to: '2022-10-30',
        period: 'd'
        });
    // console.log(eredmeny[eredmeny.length-1])
//         return {eredmeny}
// }
let eredmeny=eredmeny_not_reversed.reverse()
    
    async function trainModel(X, Y, window_size, n_epochs, learning_rate, n_layers, callback){
      // console.log(X)
      const batch_size = 32;
    
      // input dense layer
      const input_layer_shape = window_size;
      const input_layer_neurons = 64;
    
      // LSTM
      const rnn_input_layer_features = 16;
      const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;
      const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps]; // the shape have to match input layer's shape
      const rnn_output_neurons = 16; // number of neurons per LSTM's cell
      console.log("eddig eljut 1")
      // output dense layer
      const output_layer_shape = rnn_output_neurons; // dense layer input size is same as LSTM cell
      const output_layer_neurons = 1; // return 1 value
      console.log("eddig eljut 2")
    
      // ## old method
      // const xs = tf.tensor2d(X, [X.length, X[0].length])//.div(tf.scalar(10));
      // const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1])//.div(tf.scalar(10));
    
      // ## new: load data into tensor and normalize data
    
      const inputTensor = tf.tensor2d(X, [X.length, parseInt(X[0].length)])
      console.log("eddig eljut 3.5")
      const labelTensor = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1])
      console.log("eddig eljut 3")
      
      const [xs, inputMax, inputMin] = normalizeTensorFit(inputTensor)
      const [ys, labelMax, labelMin] = normalizeTensorFit(labelTensor)
      console.log("eddig eljut 4")
    
      // ## define model
    
      const model = tf.sequential();
      console.log("eddig eljut 5 ")
      
      model.add(tf.layers.dense({units: input_layer_neurons, inputShape: [input_layer_shape]}));
      model.add(tf.layers.reshape({targetShape: rnn_input_shape}));
    
      let lstm_cells = [];
      for (let index = 0; index < n_layers; index++) {
           lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons}));
      }
    
      model.add(tf.layers.rnn({
        cell: lstm_cells,
        inputShape: rnn_input_shape,
        returnSequences: false
      }));
    
      model.add(tf.layers.dense({units: output_layer_neurons, inputShape: [output_layer_shape]}));
    
      model.compile({
        optimizer: tf.train.adam(learning_rate),
        loss: 'meanSquaredError'
      });
    
      // ## fit model
    
      const hist = await model.fit(xs, ys,
        { batchSize: batch_size, epochs: n_epochs, callbacks: {
          onEpochEnd: async (epoch, log) => {
            callback(epoch, log);
          }
        }
      });
      console.log(model.summary())
        // await model.save('file:///ml_model');
        // await model.save('file:///./ml_model');
        
        //modell saving for later usage (to make my life easier :) )
        // await model.save('file:///Users/Morzsi/Documents/proba/Project-Lab2/ml_model');


      // return { model: model, stats: hist };
      return { model: model, stats: hist, normalize: {inputMax:inputMax, inputMin:inputMin, labelMax:labelMax, labelMin:labelMin} };
    }
    
    function makePredictions(X, model, dict_normalize)
    {
        // const predictedResults = model.predict(tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10))).mul(10); // old method
        
        X = tf.tensor2d(X, [X.length, X[0].length]);
        const normalizedInput = normalizeTensor(X, dict_normalize["inputMax"], dict_normalize["inputMin"]);
        const model_out = model.predict(normalizedInput);
        const predictedResults = unNormalizeTensor(model_out, dict_normalize["labelMax"], dict_normalize["labelMin"]);
    
        return Array.from(predictedResults.dataSync());
    }
    
    function normalizeTensorFit(tensor) {
      const maxval = tensor.max();
      const minval = tensor.min();
      const normalizedTensor = normalizeTensor(tensor, maxval, minval);
      return [normalizedTensor, maxval, minval];
    }
    
    function normalizeTensor(tensor, maxval, minval) {
      const normalizedTensor = tensor.sub(minval).div(maxval.sub(minval));
      return normalizedTensor;
    }
    
    function unNormalizeTensor(tensor, maxval, minval) {
      const unNormTensor = tensor.mul(maxval.sub(minval)).add(minval);
      return unNormTensor;
    }
    
    
    let window_size = 25;

    var closing_prices=[]
    for (let i = 0; i < eredmeny.length; i++) {
      closing_prices.push((eredmeny[i].close))
    }
    var dates=[]
    for (let i = 0; i < eredmeny.length; i++) {
      dates.push(Rounder(eredmeny[i].date))
    }

    var sma_sajat=25
    var mov_avg_res=[]
    mov_avg_res=new Array(sma_sajat-1).fill(null);
  
    var temp_mov_avg=[]
    temp_mov_avg = SMA.calculate({period: sma_sajat, values: closing_prices});
    mov_avg_res= mov_avg_res.concat(temp_mov_avg)
    
    
    function time_stepper(given_array) {
      console.log("aaaa",given_array.length)
      var adat=[]
      for (let i = 0; i < given_array.length; i++) {
        if (i+25>given_array.length){
          // var k=given_array.length-i
          // adat.push(given_array.slice(i,i+k))
          break
        }else{
          adat.push(given_array.slice(i,i+25))
        } 
      }
      return adat
    }


  var closing_stepped=time_stepper(closing_prices)
  var ma_stepped=time_stepper(mov_avg_res)
  var dates_stepped=time_stepper(dates)
    
    // searchOptions.sma=req.query.sma
  async function onClickPredict() {

      let pred_X = [inputs[inputs.length-1]];
      console.log("pred_X.length:",pred_X.length)
      console.log("pred_X:",pred_X)
      console.log("[inputs[inputs.length-1]]:",[inputs[inputs.length-1]])
      console.log("trainingsize / 100 * pred_X.length:",trainingsize / 100 * pred_X.length)
      
      // pred_X = pred_X.slice(Math.floor(trainingsize / 100 * pred_X.length), pred_X.length);
      let pred_y = makePredictions(pred_X, result['model'], result['normalize']);
      console.log("pred_X.length:",pred_X.length)
      console.log("pred_X:",pred_X)
      console.log("pred_y",pred_y)
      window_size = 25;
      return pred_y
    }



  async function onClickTrainModel(){

    let epoch_loss = [];
    let inputs = closing_stepped
    let outputs = temp_mov_avg
    let trainingsize = 98
    let n_epochs = 15
    let learningrate = 0.01
    let n_hiddenlayers = 2
                                      //  (   98          / 100 + 1155)
    inputs = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
    outputs = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length));
  
    let callback = function(epoch, log) {
      let logHtml = ""
      logHtml = "Epoch: " + (epoch + 1) + " (of "+ n_epochs +")" +
        ", loss: " + log.loss +
        // ", difference: " + (epoch_loss[epoch_loss.length-1] - log.loss) +
        "" + logHtml;
      console.log(logHtml)
      epoch_loss.push(log.loss);
      };
  
    // console.log('train X', inputs)
    // console.log('train Y', outputs)
    result = await trainModel(inputs, outputs, window_size, n_epochs, learningrate, n_hiddenlayers, callback);
  
    
    // console.log(logHtml)
    console.log(result)
    return result
    }

    var result = await onClickTrainModel()
    let inputs = closing_stepped
    let outputs = temp_mov_avg
    let trainingsize = 98
    let pred_y= await onClickPredict()
    // await model.save('file:///ml_model');




    res.render('indexesmodel',{pred_y:pred_y,closing_prices:closing_prices,temp_mov_avg:temp_mov_avg,mov_avg_res:mov_avg_res,closing_stepped:closing_stepped,ma_stepped:ma_stepped,dates:dates,dates_stepped:dates_stepped,result:result})
    
     }
     )


     app.get('/predict/:Symbol', async(req, res) => {
      const symbol= req.params.Symbol
      const  queriedStock = await Stock.findOne({Symbol: symbol})
      // async function get_stock_data(){

        // symbol: "AAPL",
        // from: '2022-02-02',
        // to: '2022-10-30',
        let todayDate= DateCreator(0)
        let eredmeny_not_reversed= await yahooFinance.historical({
          symbol: symbol,
          from: '2002-01-01',
          to: todayDate,
          period: 'd'
          });
          let eredmeny=eredmeny_not_reversed.reverse()
          var closing_prices=[]
    for (let i = 0; i < eredmeny.length; i++) {
      closing_prices.push(Rounder(eredmeny[i].close))
    }
    var dates=[]
    for (let i = 0; i < eredmeny.length; i++) {
      dates.push((eredmeny[i].date))
    }

    var sma_sajat=25
    var mov_avg_res=[]
    mov_avg_res=new Array(sma_sajat-1).fill(null);
  
    var temp_mov_avg=[]
    temp_mov_avg = SMA.calculate({period: sma_sajat, values: closing_prices});
    mov_avg_res= mov_avg_res.concat(temp_mov_avg)
    
    
    function time_stepper(given_array) {
      console.log("aaaa",given_array.length)
      var adat=[]
      for (let i = 0; i < given_array.length; i++) {
        if (i+25>given_array.length){
          // var k=given_array.length-i
          // adat.push(given_array.slice(i,i+k))
          break
        }else{
          adat.push(given_array.slice(i,i+25))
        } 
      }
      return adat
    }


  var closing_stepped=time_stepper(closing_prices)
  var ma_stepped=time_stepper(mov_avg_res)
  var dates_stepped=time_stepper(dates)
    

          let inputs = closing_stepped
          let outputs = temp_mov_avg
          let trainingsize = 98
          function normalizeTensor(tensor, maxval, minval) {
            const normalizedTensor = tensor.sub(minval).div(maxval.sub(minval));
            return normalizedTensor;
          }
          
          function unNormalizeTensor(tensor, maxval, minval) {
            const unNormTensor = tensor.mul(maxval.sub(minval)).add(minval);
            return unNormTensor;
          }


          function normalizeTensorFit(tensor) {
            const maxval = tensor.max();
            const minval = tensor.min();
            const normalizedTensor = normalizeTensor(tensor, maxval, minval);
            return [normalizedTensor, maxval, minval];
          }

          function makePredictions(X, model, dict_normalize)
          {
              outputs = outputs.slice(Math.floor(trainingsize / 100 * outputs.length),outputs.length);
              let Y=outputs
              // const predictedResults = model.predict(tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10))).mul(10); // old method
              const inputTensor = tf.tensor2d(X, [X.length, parseInt(X[0].length)])
              console.log("eddig eljut 3.5")
              const labelTensor = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1])
              console.log("eddig eljut 3")
              
              const [xs, inputMax, inputMin] = normalizeTensorFit(inputTensor)
              const [ys, labelMax, labelMin] = normalizeTensorFit(labelTensor)

              X = tf.tensor2d(X, [X.length, X[0].length]);
              const normalizedInput = normalizeTensor(X, inputMax, inputMin);
              const model_out = model.predict(normalizedInput);
              // const model_out = model.predict(X);
              // console.log(model_out.dataSync())
              const predictedResults = unNormalizeTensor(model_out, labelMax, labelMin);
          
              return Array.from(predictedResults.dataSync());
          }
          const model = await tf.loadLayersModel('file:///Users/Morzsi/Documents/proba/Project-Lab2/ml_model/model.json');

          let pred_X = [inputs[inputs.length-1]];
      console.log("pred_X.length:",pred_X.length)
      console.log("pred_X:",pred_X)
      console.log("[inputs[inputs.length-1]]:",[inputs[inputs.length-1]])
      console.log("trainingsize / 100 * pred_X.length:",trainingsize / 100 * pred_X.length)
      
      pred_X = pred_X.slice(Math.floor(trainingsize / 100 * pred_X.length), pred_X.length);

      let pred_y = makePredictions(pred_X, model, model.normalize);
      // X = tf.tensor2d(pred_X, [pred_X.length, pred_X[0].length])
      //     const prediction = model.predict(X).dataSync()[0];
          console.log(pred_y);
          console.log(todayDate)
          res.render('predict_stock_price',{todayDate:todayDate,dates:dates,closing_prices:closing_prices,stock_data:queriedStock,predicted_price:Rounder(pred_y)})
    
        }
        )