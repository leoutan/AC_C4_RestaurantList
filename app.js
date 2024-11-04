const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const port = 3000

app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')


// 路由設置
app.get('/', (req, res)=>{
  res.render('index')
})

app.listen(port, ()=>{
  console.log(`server is working on http://localhost:${port}`)
})