module.exports = (req, res, next)=>{
  console.log('req.session: ', req.session)
  console.log('req.user: ', req.user)
  // if (req.session.user) {
  //   return next()
  // }
  if(req.isAuthenticated()){
    return next()
  }
  req.flash('error', '請先登入')
  return res.redirect('/login')
}