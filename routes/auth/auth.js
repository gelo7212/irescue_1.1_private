var express = require('express');
var router = express.Router();
var Password =require('./../../function/password/password')
var auth = require('./../../function/auth/auth');
var Admin = require('../../function/admin/admin')
var bcrypt = require('./../../function/bcrypt/bcrypt')
var jwt = require('./../../function/jwt/jwt')
router.post('/',function(req,res,next){
  res.send('FUCK YOU ')
})
// ---------------------------------- Login Route ---------------------------
router.post( '/user',auth.isCookieAvailable, async function(req, res, next) {
  try{
    req.check('username','Invalid username').isLength({min:5}).withMessage('Username must be at least 5 chars long')
    req.check('password','Invalid password').isLength({min:5}).withMessage('Password must be at least 5 chars long')
    .matches(/\d/).withMessage('Password must contain a number')
    var errors = req.validationErrors();
    if(errors){
      console.log(errors.find(x => x.location === 'body').msg)
      res.render('includes/components/alert/alert-danger',{heading:errors.find(x => x.location === 'body').msg,message:errors.find(x => x.location === 'body').value,message_bottom:'',success:false})
    }else{
      var username = req.body.username
      var password = req.body.password
      var table = req.body.table
      var admin_tbl = 'account_admin'
      var client = 'account_client'
          if(table === 'admin'){
            var ID = await Admin.isRegister(username)
            console.log(ID)
            if(ID !=false){
              Admin.info(ID).then(user=>{
                if(!user.Account_DISABLE){
                  Password.getPass(ID,admin_tbl).then(hash=>{
                    bcrypt.compareHash(password,hash).then(isValid=>{
                      if(isValid){
                        jwt.encrypt(user,'24h').then(token=>{
                          var hostname = req.headers.host;
                          res.cookie('_d.r', token, {  path: '/',expires: new Date(Date.now() + 60000*60*12), httpOnly: true })
                          res.send({ title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
                        })
                      }
                    })
                  })
                }else{
                  res.render('includes/components/alert/alert-danger',{heading:'Account Disabled',message:'Your email '+user.Account_EMAIL+' is banned for using the service .',message_bottom:'Contact administrator.',success:false})
                }
              }).catch(function(err){
                res.render('includes/components/alert/alert-danger',{heading:'Internal Error',message:'',message_bottom:'Contact administrator.',success:false})
              })
              
              
            }else{
              res.render('includes/components/alert/alert-danger',{heading:'Username or password was Incorrect.',message:'Username or password was Incorrect.',message_bottom:'Username or password was Incorrect.',success:false})
            }
          }
          else if(table === 'client'){
            await Password.getPass(_id,client)
          }else{
            res.render('includes/components/alert/alert-danger',{heading:'Route not found.',message:'Route not found.',message_bottom:'Route not found.',success:false})
        }
        
    }
      
  }catch(e){
    console.log(e)
  }
})
router
.post( '/logout', async function(req, res, next) {
  res.cookie('_d.r', 'token=deleted', {  path: '/',expires: new Date(Date.now()), httpOnly: true })
  res.send({ title: 'Express' ,authorized:false});
})
module.exports = router;

