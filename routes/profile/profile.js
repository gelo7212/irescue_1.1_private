var express = require('express');
var router = express.Router();
var Admin = require('../../function/admin/admin');
var Client = require('../../function/client/user');
var formattedDate = require('../../function/date')
router.route('/')
.get(Admin.checkToken,function(req, res, next) {
    res.render('includes/profile/profile',{
        title: 'Express',
        authorized:true,
        Account_ID:req.decoded.Account_ID,
        Account_NAME:req.decoded.Account_NAME,
        Account_USERNAME:req.decoded.Account_USERNAME,
        Account_TYPE_ID:req.decoded.Account_TYPE_ID,
        Account_EMAIL:req.decoded.Account_EMAIL,
        Account_LOCATION:req.decoded.Account_LOCATION,
        Account_ISVERIFY:req.decoded.Account_ISVERIFY,
        route:'PROFILE'})
})