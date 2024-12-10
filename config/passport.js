const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const { where } = require('sequelize')

// 以帳號密碼登入
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

// 以第三方登入
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL:process.env.FACEBOOK_CALLBACK_URL,
  profileFields:['email', 'displayName']
}, (accessToken, refreshToken, profile, done)=>{
  console.log('accessToken: ', accessToken)
  console.log('profile: ', profile)
  const email = profile.emails[0].value
  const name = profile.displayName
  return User.findOne({where:{email}})
    .then((user)=>{
      if(user) {
        return done(null, user)
      }
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then((hash)=>{return User.create({name, email, password:hash})})
        .then((user)=>{return done(null, user)})
    })
    .catch((error)=>{
      error.errorMessage = '登入失敗'
      return done(error)
    })
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

module.exports = passport