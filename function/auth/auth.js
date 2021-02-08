var jwt = require('../jwt/jwt');
function redirectToadmin(req, res, next) {
  jwt.decrypt(req.token).then(token => {
    console.log(token)
    if (token != false) {
      res.send({ authorized: true });
    } else {
      next()
    }
  })
}
function isCookieAvailable(req, res, next) {
  var token = req.cookies['_d.r']
  if (typeof token !== 'undefined') {
    req.token = token
    redirectToadmin(req, res, next)
  } else {
    next()
  }
}
module.exports = {
  redirectToadmin, isCookieAvailable
}