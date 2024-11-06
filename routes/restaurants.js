const express = require('express')
const router = express.Router()

const db = require('../models')  //從app.js拉進來要多一個點
const { where } = require('sequelize')
const restaurant = db.restaurant

router.get('/', (req, res)=>{
  try {
    return restaurant.findAll({
    // attributes: ['id', 'name', 'name_EN', 'image', 'address', 'phone', 'description', 'rating'],
      raw:true
    })
    .then((restaurants)=>{
      const keyword = req.query.keyword?.toLowerCase().trim()
      const filteredKeys = ['name', 'category', 'description']
      const filteredRestaurants = keyword?restaurants.filter((rt)=>
        Object.keys(rt).some((key)=>{
          if (filteredKeys.includes(key)) {
            return rt[key].toLowerCase().includes(keyword)
          } else {
            return false
          }
        })
      ):restaurants
      if (filteredRestaurants.length > 0 ) {
        res.render('restaurants', {restaurants: filteredRestaurants, message: req.flash('success'), error: req.flash('error')})
      } else {
        req.flash('error', '關鍵字找不到餐廳')
        res.redirect('back')
      }
      
    })
    .catch((error)=>{
      console.error(error)
      req.flash('error', '資料載入失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
  
  
})

router.get('/new', (req, res)=>{
  try {
    res.render('new', {error: req.flash('error')})
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
  
})

router.get('/:id', (req, res)=>{
  try {
    const id = req.params.id
    return restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant)=>{
      res.render('restaurant', {restaurant})
    })
    .catch((error)=>{
      console.error(error)
      req.flash('error', '資料載入失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

router.get('/:id/edit', (req, res)=>{
  try {
    const id = req.params.id
    return restaurant.findByPk(id, {
      raw:true
    })
    .then((restaurant)=>{
      res.render('edit', {restaurant, error: req.flash('error')})
    })
    .catch((error)=>{
      console.error(error)
      req.flash('error', '資料載入失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
})

router.post('/', (req, res)=>{
  try {
    const body = req.body
    return restaurant.create(body)
    .then(()=>{
      req.flash('success', '新增成功')
      res.redirect('/restaurants')
    })
    .catch((error)=>{
      console.error(error)
      req.flash('error', '新增失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
  
})

router.put('/:id', (req, res)=>{
  try {
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
    .catch((error)=>{
      console.error(error)
      req.flash('error', '更新失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
  
})

router.delete('/:id', (req, res)=>{
  try {
    const id = req.params.id
    return restaurant.destroy({where:{id:id}})
    .then(()=>{
      req.flash('success', '刪除成功')
      res.redirect('/restaurants')
    })
    .catch((error)=>{
      console.error(error)
      req.flash('error', '刪除失敗')
      res.redirect('back')
    })
  } catch (error) {
    console.error(error)
    req.flash('error', '伺服器錯誤')
    res.redirect('back')
  }
  
  res.send('刪除餐廳')
})

module.exports = router  //導出給總路由器使用