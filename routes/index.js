const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants) //前綴詞為 /restaurants的請求會被引到 restaurants 路由器

// 路由設置
router.get('/', (req, res)=>{
  res.redirect('/restaurants')
})


module.exports = router  //導出給主程式使用