const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User

const passport = require('passport')

const { where } = require('sequelize')

const bcrypt = require('bcryptjs')



router.get('/login', (req, res, next)=>{
  res.render('login')
})

// 以 passport-local 做登入
router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))

// 以 passport-facebook 做登入
router.get('/login/facebook', passport.authenticate('facebook', {
  scope:['email']
}))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect:'/restaurants',
  failureRedirect:'/login',
  failureFlash:true
}))



// 以原生做登入
// router.post('/login', (req, res, next)=>{
//   const {email, password} = req.body
//   return User.findOne({
//     where : {email}
//   })
//     .then((user)=>{
//       if(!user) {
//         req.flash('error', 'email 不存在')
//         return res.redirect('back')
//       }
//       return bcrypt.compare(password, user.password)
//         .then((isMatch)=>{
//           if(!isMatch) {
//             req.flash('error', '密碼不正確')
//             return res.redirect('back')
//           }
//           const {id, name, email} = user
//           req.session.user = {id, name, email}
//           console.log('req.session: ', req.session)
//           console.log('req.session.user: ', req.session.user)
//           return res.redirect('/restaurants')
//         })
//     })
// })

// 以passport登出
router.post('/logout', (req, res, next)=>{
  req.logout((error)=>{
    if(error){
      return next(error)
    }
    req.session.destroy()
    return res.redirect('/login')
  })
})

// router.post('/logout', (req, res, next)=>{
//   console.log('req.session: ', req.session)
//   req.session.destroy((error)=>{
//     if(error) {
//       console.error('Session destruction failed:', err);
//       return res.status(500).send('登出失敗，請稍後再試');
//     }
//     console.log('req.session: ', req.session)
//     return res.redirect('/login')
//   })
// })

module.exports = router