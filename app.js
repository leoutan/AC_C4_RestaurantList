const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const port = 3000

const db = require('./models')
const restaurant = db.restaurant


app.engine('.hbs', engine({extname:'.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')


// 路由設置
app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/restaurants', (req, res)=>{
  res.render('restaurants')
})

app.get('/restaurants/:id', (req, res)=>{
  const id = req.params.id
  res.render('restaurant', {id})
})

app.get('/restaurants/new', (req, res)=>{
  res.render('new')
})

app.get('/restaurants/:id/edit', (req, res)=>{
  const id = req.params.id
  res.render('edit', {id})
})

app.post('/restaurants', (req, res)=>{
  res.send('新增餐廳')
})

app.put('/restaurants/:id', (req, res)=>{
  res.send('編輯餐廳')
})

app.delete('/restaurants/:id', (req, res)=>{
  res.send('刪除餐廳')
})


app.listen(port, ()=>{
  console.log(`server is working on http://localhost:${port}`)
})