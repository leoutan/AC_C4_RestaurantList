const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const port = 3000

const flash = require('connect-flash')
const session = require('express-session')

const router = require('./routes')  //載入總路由模組

const methodOverride = require('method-override')


app.engine('.hbs', engine({extname:'.hbs'}))  //設定 view engine
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public')) //靜態檔案用
app.use(express.urlencoded({extended: true}))  //要取得 POST 請求的資料要用的
app.use(methodOverride('_method'))  //表單要以 GET POST 以外的方式發送時，需載入


app.use(session({  //提示訊息用
  secret: "ThisisSecret",
  resave: false,
  saveUninitialized: false
}))

app.use(flash())  //提示訊息用
app.use(router) 



app.listen(port, ()=>{
  console.log(`server is working on http://localhost:${port}`)
})