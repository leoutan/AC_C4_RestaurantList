const express = require('express')
const router = express.Router()

const db = require('../models')  //從app.js拉進來要多一個點
const restaurant = db.restaurant

router.get('/', (req, res)=>{
  return restaurant.findAll({
    // attributes: ['id', 'name', 'name_EN', 'image', 'address', 'phone', 'description', 'rating'],
    raw:true
  })
  .then((restaurants)=>{
    res.render('restaurants', {restaurants, message: req.flash('success')})
  })
  
})

router.get('/new', (req, res)=>{
  res.render('new')
})

router.get('/:id', (req, res)=>{
  const id = req.params.id
  res.render('restaurant', {id})
})

router.get('/:id/edit', (req, res)=>{
  const id = req.params.id
  return restaurant.findByPk(id, {
    raw:true
  })
  .then((restaurant)=>{
    res.render('edit', {restaurant})
  })
  res.render('edit', {id})
})

router.post('/', (req, res)=>{
  const body = req.body
  return restaurant.create(body)
  .then(()=>{
    req.flash('success', '新增成功')
    res.redirect('/restaurants')
  })
  res.send('新增餐廳')
})

router.put('/:id', (req, res)=>{
  const id = req.params.id
  const body = req.body
  return restaurant.update(body, {
    where :{
      id:id
    }
  })
  .then(()=>{
    req.flash('success', '更新成功')
    res.redirect('/restaurants')
  })
})

router.delete('/:id', (req, res)=>{
  res.send('刪除餐廳')
})

module.exports = router  //導出給總路由器使用