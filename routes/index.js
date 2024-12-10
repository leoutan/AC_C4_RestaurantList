const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const register = require('./register')
const login_logout = require('./login_logout')

const authhandler = require('../middlewares/auth-handler')

router.use('/restaurants', authhandler, restaurants) //前綴詞為 /restaurants的請求會被引到 restaurants 路由器
router.use('/register', register)
router.use('/', login_logout)

// 路由設置
router.get('/', (req, res)=>{
  res.redirect('/restaurants')
})



module.exports = router  //導出給主程式使用