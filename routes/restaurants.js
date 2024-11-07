const express = require('express')
const router = express.Router()

const db = require('../models')  //從app.js拉進來要多一個點
const { where } = require('sequelize')
const restaurant = db.restaurant

const {Op} = require('sequelize')

router.get('/', (req, res, next)=>{
  const limit = 6
  const page = parseInt(req.query.page) || 1
  const keyword = req.query.keyword?.toLowerCase().trim()
  const keywordCondition = keyword?{
    [Op.or] : [
      {name: {[Op.like]:`%${keyword}%`}},
      {category: {[Op.like]:`%${keyword}%`}},
      {description:{[Op.like]:`%${keyword}%`}}
    ]
  }:{}
    return restaurant.findAndCountAll({
      where: keywordCondition,
      offset: (page-1)*limit,
      limit: limit,
      raw:true
    })
    .then(({count, rows: restaurants})=>{
      const prev = page>1 ? page-1 : page
      const maxPage = Math.ceil(count/limit)
      const next = page<maxPage ? page+1 : page
      res.render('restaurants', {restaurants, prev, next, maxPage, page, keyword})
      // return ({prev, next, maxPage, restaurants})
    })
    // .then(({prev, next, maxPage, restaurants})=>{
    //   console.log(restaurants)
    //   const keyword = req.query.keyword?.toLowerCase().trim()
    //   const filteredKeys = ['name', 'category', 'description']
    //   const filteredRestaurants = keyword?restaurants.filter((rt)=>
    //     Object.keys(rt).some((key)=>{
    //       if (filteredKeys.includes(key)) {
    //         return rt[key].toLowerCase().includes(keyword)
    //       } else {
    //         return false
    //       }
    //     })
    //   ):restaurants
    //   res.render('restaurants', {restaurants: filteredRestaurants, prev, next, maxPage, page})
      // if (filteredRestaurants.length > 0 ) {
      //   res.render('restaurants', {restaurants: filteredRestaurants, prev, next, maxPage, page})
      // } else {
      //   req.flash('error', '關鍵字找不到餐廳')
      //   res.redirect('back')
      // }
      
    // })
    .catch((error)=>{
      error.errorMessage = '資料載入失敗'
      next(error)
    })
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

router.post('/', (req, res, next)=>{
    const body = req.body
    return restaurant.create(body)
    .then(()=>{
      req.flash('success', '新增成功')
      res.redirect('/restaurants')
    })
    .catch((error)=>{
      error.errorMessage = '新增失敗'
      next(error)
    })
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
      res.redirect(`/restaurants/${id}`)
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