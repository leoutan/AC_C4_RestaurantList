const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const { where } = require('sequelize')

const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done)=>{
  
  //以email查詢資料表是否有該用戶
  return User.findOne({
    attributes : ['id', 'email', 'password'],
    where:{email},
    raw:true
  })
    .then((user)=>{
      if(!user) {
        return done(null, false, {type:'error', message:'email不存在'})
      }

      // 有該用戶存在就將輸入的密碼做加密再與資料表的密碼比對
      return bcrypt.compare(password, user.password)
        .then((isMatch)=>{
          if(!isMatch) {
            return done(null, false, {type:'error', message:'密碼錯誤'})
          }
          return done(null, user, {type:'success', message:'登入成功'})
        })
    })
    .catch((error)=>done(error))
}))

// 序列化: 將用戶資訊存放到session
passport.serializeUser((user, done)=>{
  return done(null, {id:user.id})
})

// 反序列化: 將session中的資料取出，直接放到req.user，或是先到資料庫取資料再放到req.user
passport.deserializeUser((user, done)=>{
  const id = user.id
  return User.findOne({where:{id}})
    .then((user)=>{
      const {id, name, email} = user
      return done(null, {id, name, email})
    })
})

router.get('/login', (req, res, next)=>{
  res.render('login')
})

// 登入
router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

// 登出
router.post('/logout', (req, res, next)=>{
  req.logout((error)=>{
    if(error){
      return next(error)
    }
    res.redirect('/login')
  })
})

module.exports = router