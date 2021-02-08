var express = require('express');
var router = express.Router();
var jwt = require('./../../function/jwt/jwt')
var Admin = require('../../function/admin/admin');
var io = require('../../function/socket-io/socket-io')
/* GET home page. */
router.route('/')
.get(Admin.checkToken,function(req, res, next) {
    res.render('includes/base/base', { 
      title: 'Express' ,
      authorized:true,
      Account_ID:req.decoded.Account_ID,
      Account_NAME:req.decoded.Account_NAME,
      Account_USERNAME:req.decoded.Account_USERNAME,
      Account_TYPE_ID:req.decoded.Account_TYPE_ID,
      Account_EMAIL:req.decoded.Account_EMAIL,
      Account_LOCATION:req.decoded.Account_LOCATION,
      Account_ISVERIFY:req.decoded.Account_ISVERIFY,
      route:'MAP'});
})
.post(Admin.checkToken,function(req, res, next) {
      res.render('includes/base/baseMap', { 
        title: 'Express' ,
        authorized:true,
        Account_ID:req.decoded.Account_ID,
        Account_NAME:req.decoded.Account_NAME,
        Account_USERNAME:req.decoded.Account_USERNAME,
        Account_TYPE_ID:req.decoded.Account_TYPE_ID,
        Account_EMAIL:req.decoded.Account_EMAIL,
        Account_LOCATION:req.decoded.Account_LOCATION,
        Account_ISVERIFY:req.decoded.Account_ISVERIFY});
  })

module.exports = router;
