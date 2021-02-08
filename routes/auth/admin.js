var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var User = require('./../../function/client/user');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var Admin = require('./../../function/admin/admin');
var email = require('./../../function/email/email');
var jwt = require('./../../function/jwt/jwt');
var uuidv1 = require('uuid/v1'); 
var uuidv3 = require('uuid/v3');
var auth = require('./../../function/auth/auth');
const me = require('./../../function/me')
router.get('/',Admin.checkadminCount,function(req,res,next){
  try {
    var token = req.cookies['_d.r']
    if(typeof token !== 'undefined'){
      req.token = token
      next()
    }else{
      res.render('./includes/Admin/login');
    }
  } catch (error) {
    console.error(error)
    next(error)
  }
  
},function(req,res,next){
  jwt.decrypt(req.token).then(token=>{
    console.log('Suspect ',token)
    if(token!=false){
        res.redirect('/')
    }else{
        next()
    }
  })
  
},function(req,res,next){
  res.render('./includes/Admin/login');
})
router.route('/setup')
  .get(Admin.checkadmin,function(req,res,next){
  res.render('./includes/admin/setup');
  res.end();
})
  .post(Admin.checkadmin,function(req,res,next){ 
    try {
      req.check('email','Invalid email address').isEmail();
      var Errors = req.validationErrors();
      if(Errors){
        console.log(Errors)
        res.render('includes/components/alert/alert-warning',{heading:'Fill up form.',message:Errors.msg,message_bottom:'',success:false})
      }else{
        // res.cookie('_c',,{maxAge:Math.floor(Date.now() / 1000) + (60 * 60)})
        const data = {
          Account_ID:null,
          Account_NAME:req.body.firstname+' '+req.body.lastname,
          Account_USERNAME:req.body.username,
          Account_TYPE_ID:req.body.level,
          Account_EMAIL:req.body.email,
          Account_Province:req.body.location,
          Account_ISVERIFY:false,
          isFirst:true
        }
        Admin.create_temp_account(req,res,next,data)
        
      }
     } catch (error) {
      console.error(error)
      next(error)
    }
  
})
router.get('/setup/:token',Admin.checkadmin,async function(req,res,next){
  const userTempDetails = await Admin.userTempInfo(req.params.token) 
  if(typeof userTempDetails !='undefined'){
    res.render('./includes/verification/codeEmailVerification',{token:req.params.token,email:req.query.email,name:req.query.name,username:req.query.username})
  }else{
    const err = {
      status:410,
      message:'Link expired.'
    }
    next(err)
  }
  })
router.post('/setup/:token/verify/',Admin.checkadmin,async function(req,res,next){
  try {
    var code = req.session._code
    var code_user = req.body.first+'-'+req.body.second+'-'+ req.body.third
    const userTempDetails = await Admin.userTempInfo(req.params.token) 
    if(typeof userTempDetails !='undefined'){
      console.log(code_user + '  '+code);
      if(code === code_user){
        console.log('same '+code);
        res.render('./includes/verification/codeEmailVerification',{token:req.params.token,_verify:true,mess:false});
      }else{
        console.log('not '+code);
        res.redirect('/');
      }
    }else{
      const err = {
        status:410,
        message:'Link expired.'
      }
      next(err)
    }
    
  } catch (error) {
    console.error(error)
    next(error)
  }
 
  //res.render('./includes/admin/setup')
})
router.get('/setup/:token/verify/',Admin.checkadmin,async function(req,res,next){
  try {
    var code = req.session._code
    var code_user = req.body.first+'-'+req.body.second+'-'+ req.body.third
    const userTempDetails = await Admin.userTempInfo(req.params.token) 
    if(typeof userTempDetails !='undefined'){
      console.log(code_user + '  '+code);
      if(code === code_user){
        console.log('same '+code);
        res.render('./includes/verification/codeEmailVerification',{token:req.params.token,_verify:true,mess:false});
      }else{
        console.log('not '+code);
        res.redirect('/');
      }
    }else{
      const err = {
        status:410,
        message:'Link expired.'
      }
      next(err)
    }
    
  } catch (error) {
    console.error(error)
    next(error)
  }
 
  //res.render('./includes/admin/setup')
})
router.route('/setup/:token/register',Admin.checkadmin)
.post(async function(req,res,next){
  try {
    const userTempDetails = await Admin.userTempInfo(req.params.token) 
    if(typeof userTempDetails !='undefined'){
      me.jwt.decrypt(userTempDetails.TOKEN).then(user=>{
        if(user!=false){
          Admin.create_Admin_Account(req,res,next,user,'/Administrator/setup/'+userTempDetails.UUID+'/register')
          console.log(user)
          next()
        }else{
          console.log(req.body.password)
          res.redirect('/');
        }
      })
      
    }else{
      const err = {
        status:410,
        message:'Link expired.'
      }
      next(err)
    }
    
  } catch (error) {
    console.error(error ,' @ /setup/:token/register')
    next(error)
  }
  
  //res.render('./includes/admin/setup')
},async function(req,res,next){
  console.log('redirecting')
  try {
    const userTempDetails = await Admin.userTempInfo(req.params.token) 
    me.jwt.decrypt(userTempDetails.TOKEN).then(user=>{
      res.render('./includes/verification/codeEmailVerification',{_verify:true,mess:user,success:true});
    })
    
  } catch (error) {
    console.error(error)
  }
  
  //res.redirect('/Administrator/setup/'+userTempDetails.UUID+'/register');
})
.get(async function(req,res,next){
  //res.redirect()
  try {
    const userTempDetails = await Admin.userTempInfo(req.params.token)
    if(typeof userTempDetails !='undefined'){
      me.jwt.decrypt(userTempDetails.TOKEN).then(user=>{
        if(user!=false){
          res.render('./includes/verification/codeEmailVerification',{_verify:true,mess:user});
        }else{
          res.redirect('/');
        }
      })
        
    }else{
      const err = {
        status:410,
        message:'Link expired.'
      }
      next(err)
    }
   
  } catch (error) {
    console.error(error)
    next(error)
  } 
  
})
router.route('/account/:token',auth.isCookieAvailable)
  .post(async function(req,res,next){
    try {
      const userTempDetails = await Admin.userTempInfo(req.params.token) 
      if(typeof userTempDetails !='undefined'){
        me.jwt.decrypt(userTempDetails.TOKEN).then(async user=>{
          if(user!=false){
            const isExistUsername  =await Admin.isExist(req.body.newusername,'Account_USERNAME','account_admin')
              if(parseInt(isExistUsername.a[0])>=1){
                res.render('includes/components/alert/alert-warning',{heading:'Username.',message:'user is not available',message_bottom:'Please use other username',success:false})
              }else{
                user.Account_USERNAME = req.body.newusername
                Admin.create_Admin_Account(req,res,next,user,'')
                console.log(user)
                res.render('includes/components/alert/alert-info',{heading:'Account Created.',message:'You can now sign in.',message_bottom:'',success:true})      
              }
            }else{
            console.log(req.body.password)
            res.redirect('/');
          }
        })
        
      }else{
        const err = {
          status:410,
          message:'Link expired.'
        }
        next(err)
      }
      //res.render('./includes/verification/linkverification',{token:token,uuid:userTempDetails.UUID,date: Math.floor(new Date().getTime()),heading:'Link Expired',message:'This link was expired',message_bottom:'Contact the administrator for new link'})
    } catch (error) {
      console.error(error)
      next(error)
    }
   
  })
  .get(async function(req,res,next){
    try {
      const userTempDetails =await Admin.userTempInfo(req.params.token)
      if(typeof userTempDetails !='undefined'){
        me.jwt.decrypt(userTempDetails.TOKEN).then(token=>{
            console.log(userTempDetails)
            res.render('./includes/verification/linkverification',{token:token,uuid:userTempDetails.UUID,date: Math.floor(new Date().getTime()),heading:'Link Expired',message:'This link was expired',message_bottom:'Contact the administrator for new link'})
        })
       
      }else{
        const err = {
          status:410,
          message:'Link expired.'
        }
        next(err)
      }
    } catch (error) {
      console.error(error)
      next(error)
    }
     })
router.post('/setup/resend-code',Admin.checkadmin,Admin.jwt_stat,function(req,res,next){
  //res.render('./includes/admin/setup')
})
router.get('/createMillionRecord',Admin.createMillionRecord,function(req,res,next){
  res.send(200)
})
router.get('/createMillionRecord2',function(req,res,next){
  res.send(200)
})

module.exports = router