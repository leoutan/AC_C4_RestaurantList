const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')
router.get('/', (req, res, next)=>{
  res.render('register')
})



// 新增用戶
router.post('/', (req, res, next)=>{
  const { name, email, password, confirmPassword} = req.body
  if(!email || !password) {
    req.flash('error', 'email 和 password 為必填')
    return res.redirect('back')
  }
  if(password !== confirmPassword) {
    req.flash('error', 'password 和 confirmPassword 必須相同')
    return res.redirect('back')
  }
  return User.count({where:{email}})
    .then((rowCount)=>{
      if(rowCount>0) {
        req.flash('error', 'email 被註冊了')
        return res.redirect('back')
      }
      return bcrypt.hash(password, 10)
        .then((hash)=>{
          return User.create({name, email, password:hash})
        })
    })
    .then((user)=>{
      if(!user) {
        req.flash('error', '註冊失敗')
        return res.redirect('back')
      }
      req.flash('success', '註冊成功')
      return res.redirect('/login')
    })
    .catch((error)=>{
      error.errorMessage = '註冊失敗'
      next(error)
    })











  // const body = req.body
  // // email 和 password 為必填
  // if (!(body.email.length && body.password.length)) {
  //   req.flash('error', 'email 和 password 為必填')
  //   return res.redirect('/register')
  // }

  // // password 和 confirm password 必須相同
  // if (body.password !== body.confirmPassword) {
  //   req.flash('error', 'password 和 confirm password 必須相同')
  //   return res.redirect('/register')
  // }

  // // email 是否被註冊過
  // return User.count({
  //   where:{email: body.email}
  // })
  // .then((rowCount)=>{
  //   if (rowCount > 0) {
  //     req.flash('error', 'email 已被註冊過')
  //     return res.redirect('back')
  //   } else {
  //     return User.create({name: body.name, email: body.email, password: body.password})
  //     .then(()=>{
  //       req.flash('success', '註冊成功')
  //       return res.redirect('/login')
  //     })
  //     .catch((error)=>{
  //       req.flash('error', '註冊失敗')
  //       next(error)
  //     })
  //   }
  // })
  // res.send('新增用戶成功')
})


module.exports = router