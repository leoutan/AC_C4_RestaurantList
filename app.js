const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const port = 3000



const router = require('./routes')



app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(router)



app.listen(port, ()=>{
  console.log(`server is working on http://localhost:${port}`)
})