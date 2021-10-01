const express = require('express')
// const mongoose = require('mongoose')
const ready = require('./xd') // sima 'xd' hibát ad 
// const Article = require('./models/article')
// const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

console.log()
// console.log(ready.data.toString())
// mongoose.connect('mongodb://localhost/blog', {
//   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
// })
const articles=[{
  title: 'Test',
  createdAt: 'tegnap',
  description: 'TEst'
},
{
title: 'Test',
createdAt: 'MA',
description: 'TEst'
}]

app.set('view engine', 'ejs')

app.get('/',  (req, res) => {
  res.render('index.ejs',{ articles: articles })
})



app.listen(3000)