const express = require('express')
const router = express.Router()

const db = require('../models')  //從app.js拉進來要多一個點
const { where } = require('sequelize')
const restaurant = db.restaurant
const User = db.user

const {Op} = require('sequelize')
const user = require('../models/user')

router.get('/', (req, res, next)=>{
  const userId = req.session.passport.user.id
  // const userId = req.session.user.id
  console.log('req.session: ', req.session)
  console.log('req.user: ', req.user)
  //排序方式
  const sortOption = req.query.sort
  let sortCondition = []
  switch (sortOption) {
    case 'ASC':
    case 'DESC':
      sortCondition = [['name', sortOption]]
      break;
    case 'category':
    case 'address':
      sortCondition = [[sortOption]]
      break;
    case 'rating_ASC':
      sortCondition = [['rating', 'ASC']]
      break;
    case 'rating_DESC':
      sortCondition = [['rating', 'DESC']]
      break;
  }
  //分頁
  const limit = 6
  const page = parseInt(req.query.page) || 1

  //關鍵字查詢
  const keyword = req.query.keyword?.toLowerCase().trim()
  const keywordCondition = keyword?{
    [Op.or] : [
      {name: {[Op.like]:`%${keyword}%`}},
      {category: {[Op.like]:`%${keyword}%`}},
      {description:{[Op.like]:`%${keyword}%`}}
    ]
  }:{}
    return restaurant.findAndCountAll({
      where: {[Op.and]:[
        {userId},
        {...keywordCondition}
      ]},
      order: sortCondition,
      offset: (page-1)*limit,
      limit: limit,
      raw:true
    })
    .then(({count, rows: restaurants})=>{
      const prev = page>1 ? page-1 : page
      const maxPage = Math.ceil(count/limit)
      const next = page<maxPage ? page+1 : page

      // 資料庫沒資料 跟 搜尋的關鍵字沒資料 restaurants.length 都會是 0
      // 差別在於有沒有關鍵字
      const noResult = keyword && restaurants.length === 0
      const noData = !keyword && restaurants.length === 0
      
      res.render('restaurants', {
        restaurants, 
        prev, 
        next, 
        maxPage, 
        page, 
        keyword, 
        sort: sortOption,
        noResult,
        noData
      })
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

router.get('/new', (req, res, next)=>{
    res.render('new')
})

router.get('/:id', (req, res, next)=>{
    const id = req.params.id
    // const userId = req.user.id
    const userId = req.session.passport.user.id
    return restaurant.findByPk(id, {
      raw: true
    })
    .then((restaurant)=>{
      if(!restaurant) {
        req.flash('error', '餐廳不存在')
        return res.redirect('back')
      }
      if(userId !== restaurant.userId) {
        req.flash('error', '權限不足')
        return res.redirect('back')
      }
      res.render('restaurant', {restaurant})
    })
    .catch((error)=>{
      error.errorMessage = '資料載入失敗'
      next(error)
    })
})

router.get('/:id/edit', (req, res, next)=>{
    const id = req.params.id
    return restaurant.findByPk(id, {
      raw:true
    })
    .then((restaurant)=>{
      res.render('edit', {restaurant})
    })
    .catch((error)=>{
      error.errorMessage = '資料載入失敗'
      next(error)
    })
})

// 新增餐廳
router.post('/', (req, res, next)=>{
    const body = req.body
    // const userId = req.user.id
    const userId = req.session.passport.user.id
    return restaurant.create({...body, userId})
    .then(()=>{
      req.flash('success', '新增成功')
      res.redirect('/restaurants')
    })
    .catch((error)=>{
      
      error.errorMessage = '新增失敗'
      if (error.original.code === 'ER_DATA_TOO_LONG') {
        error.errorMessage = '新增失敗(餐廳名稱長度過長)'
      }
      next(error)
    })
})

// 編輯餐廳
router.put('/:id', (req, res, next)=>{
    const id = req.params.id
    const body = req.body
    // const userId = req.user.id
    const userId = req.session.passport.user.id
    return restaurant.findByPk(id)
      .then((restaurant)=>{
        if(!restaurant) {
          req.flash('error', '資料不存在')
          return res.redirect('back')
        }
        if(userId !== restaurant.userId) {  //前面查詢資料表的結果是instance，資料外層包一個 dataValues，但因為Sequelize提供的方便性，所以能直接存取id
          console.log('userId: ', userId)
          console.log('restaurant.id: ', restaurant.id)
          req.flash('error', '權限不足')  
          return res.redirect('back')
        }
        return restaurant.update(body)
          .then(()=>{
            req.flash('success', '更新成功')
            res.redirect(`/restaurants/${id}`)
          })
      })
      .catch((error)=>{
        error.errorMessage = '更新失敗'
        if (error.original.code === 'ER_DATA_TOO_LONG') {
          error.errorMessage = '更新失敗(餐廳名稱長度過長)'
        }
        next(error)
      })
    // return restaurant.update(body, {
    //   where :{
    //     id:id
    //   }
    // })
    // .then(()=>{
    //   req.flash('success', '更新成功')
    //   res.redirect(`/restaurants/${id}`)
    // })
    // .catch((error)=>{
    //   error.errorMessage = '更新失敗'
    //   if (error.original.code === 'ER_DATA_TOO_LONG') {
    //     error.errorMessage = '更新失敗(餐廳名稱長度過長)'
    //   }
    //   next(error)
    // })
})

// 刪除餐廳
router.delete('/:id', (req, res, next)=>{
    const id = req.params.id
    // const userId = req.user.id
    const userId = req.session.passport.user.id
    return restaurant.findByPk(id)
      .then((restaurant)=>{
        if(!restaurant) {
          req.flash('error', '資料不存在')
          return res.redirect('back')
        }
        if(userId !== restaurant.userId) {
          req.flash('error', '權限不足')
          return res.redirect('back')
        }
        return restaurant.destroy()
          .then(()=>{
            req.flash('success', '刪除成功')
            res.redirect('/restaurants')
          })
      })
      .catch((error)=>{
        error.errorMessage = '刪除失敗'
        next(error)
      })
    // return restaurant.destroy({where:{id:id}})
    // .then(()=>{
    //   req.flash('success', '刪除成功')
    //   res.redirect('/restaurants')
    // })
    // .catch((error)=>{
    //   error.errorMessage = '刪除失敗'
    //   next(error)
    // })
})



module.exports = router  //導出給總路由器使用