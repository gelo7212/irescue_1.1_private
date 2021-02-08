var express = require('express');
var router = express.Router();
var Admin = require('../../function/admin/admin');
var Client = require('../../function/client/user');
const me = require('../../function/me')
var Chat = require('../../function/chat/admin_chat');
var formattedDate = require('../../function/date')
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
    route:'ACCOUNT'});
})
.post(Admin.checkToken,function(req, res, next) {
    res.render('includes/account/account', { 
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
//=====admin ban update
router.route('/admin')
.delete(Admin.checkToken,(req,res,next)=>{
    Admin.DeleteAcc(req.body._ID).then(result=>{
        if(result.affectedRows ==1){
            res.render('includes/components/alert/alert-success2',
                                    {
                                        heading:'Account Removed',
                                        message:'',
                                        message_bottom:'',
                                        success:true
                                    })
        }else{
            res.render('includes/components/alert/alert-warning',{heading:'Failed.',message:'',message_bottom:'',success:false})
           
        }
    }).catch(err=>{
        console.log(err)
        res.render('includes/components/alert/alert-warning',{heading:'Failed.',message:'500',message_bottom:'internal server error ',success:false})
    })
})
.put(Admin.checkToken,(req,res,next)=>{
    if(req.body.s == 'C'){
       Client.update({column:['Client_OPTION','Client_IS_DISABLE','Client_DATE_BANNED'],row:[req.body.l,1,req.body.d,req.body._ID]}).then(result=>{
        res.send({
            success:result
        })
       })
    }else{
        Admin.info(req.body._ID).then(infoResult=>{
            let stat = infoResult.Account_DISABLE;
            let newStat = false
            if(stat == true)
                newStat =false
            else
                newStat = true
            Admin.Block_Unblock_Account([newStat,req.body._ID]).then(result=>{
                if(result.affectedRows ==1){
                    res.send({
                        success:true
                    })
                }else{
                    res.send({
                        success:false
                    })
                }
            })
        })
    }
    
})
router.route('/create-link/')
    .post(Admin.checkToken,async function(req,res,next){
        const isExistEmail  =await Admin.isExist(req.body.newemail,'Account_EMAIL','account_admin')
        req.check('newemail','Invalid email address').isEmail();
        var Errors = req.validationErrors();
        if(Errors){
            console.log(Errors[0])
            res.render('includes/components/alert/alert-warning',{heading:'Fill up form.',message:Errors[0].msg,message_bottom:'',success:false})
        }else{
            if(parseInt(isExistEmail.a[0])>=1){
                
                res.render('includes/components/alert/alert-warning',{heading:'Email.',message:'Email is not available',message_bottom:'Please use another email',success:false})
            }else{
                Admin.Location(
                    req.body.AdminType,
                    req.body.Province,
                    req.body.Municipal,
                    req.body.Barangay).then(result=>{
                        if(result==false){
                            res.render('includes/components/alert/alert-danger',{heading:'Script Modified.',message:'The file send to the server seems modified.',message_bottom:'Your request was recorded. Dont try again! Refresh this page!',success:false})
                        }else{
                            const details = {
                                Account_NAME:req.body.fullname,
                                Account_TYPE_ID:req.body.AdminType,
                                Account_EMAIL:req.body.newemail,
                                Account_Province:req.body.Province,
                                Account_Municipal:req.body.Municipal,
                                Account_Barangay:req.body.Barangay,
                                Account_ISVERIFY:false,
                                iat: (Math.floor(new Date().getTime()/1000.0)),
                                isFirst:false
                            }
                            for (let [key, value] of Object.entries(result)) {
                                details.key = value
                                console.log(`${key}: ${value}`);
                            }
                            Admin.create_temp_account(req,res,next,details)
                        }
                    })
                
            }
        }
        
        
    })
    .get(Admin.checkToken,async function(req,res,next){
        const isExistEmail  =await Admin.isExist(req.body.newemail,'Account_EMAIL','account_admin')
        const isExistUsername  =await Admin.isExist(req.body.newemail,'Account_EMAIL','account_admin')
        console.log(isExistEmail.a[0])
        if(parseInt(isExistEmail.a[0])>=1){
            res.render('includes/components/alert/alert-warning',{heading:'Email.',message:'Email is not available',message_bottom:'Please use another email',success:false})
        }else{
            const details = {
                Account_NAME:req.body.fullname,
                Account_TYPE_ID:req.body.AdminType,
                Account_EMAIL:req.body.newemail,
                Account_Province:req.body.Province,
                Account_Municipal:req.body.Municipal,
                Account_Barangay:req.body.Barangay,
                Account_ISVERIFY:false,
                iat: (Math.floor(new Date().getTime()/1000.0)),
                isFirst:false
            }
            //console.log(Math.floor(Date.now()))
            //console.log(formattedDate.today)
            Admin.create_temp_account(req,res,next,details)
        }
    })
//============DELETE BAN MODAL
router.route('/modal')
    .post(Admin.checkToken,async (req,res,next)=>{
        let user = await Admin.info(req.body._id)
        console.log(req.body._id)
        res.render('includes/components/modals/editModal', {user:user})
    })
    .delete(Admin.checkToken,(req,res,next)=>{
        console.log(req.body.searchState,req.body )
        if(req.body.searchState == 'C'){
            Client.find(req.body._id).then(user=>{
                console.log(user[0])
                res.render('includes/components/modals/banModal', {user:user[0]})
            })
        }else{
            Admin.info(req.body._id).then(user=>{
                res.render('includes/components/modals/deleteModal', {user:user})
            })
        }
        
        
    })
    //===========ADMIN UPDATE
router.route('/admin/update')
    .post(Admin.checkToken,async (req,res,next)=>{
        const isExistEmail  =await Admin.isExist(req.body.email1,'Account_EMAIL','account_admin')
        req.check('email1','Invalid email address').isEmail();
        var Errors = req.validationErrors();
        console.log('/update')
        if(Errors){
            console.log(Errors[0])
            res.render('includes/components/alert/alert-warning',{heading:'Fill up form.',message:Errors[0].msg,message_bottom:'',success:false})
        }else{
            console.log('/update email')
            if(parseInt(isExistEmail.a[0])>=1){
                await Admin.info(req.body._ID_).then(valueIs=>{
                    if(req.body.email1 == valueIs.Account_EMAIL){
                        Admin.Location(
                            req.body.AdminType1,
                            req.body.Province1,
                            req.body.Municipal1,
                            req.body.Barangay1).then(async result=>{
                                if(result==false){
                                    res.render('includes/components/alert/alert-danger',{heading:'Script Modified.',message:'The file send to the server seems modified.',message_bottom:'Your request was recorded. Dont try again! Refresh this page!',success:false})
                                }else{
                                    const details = {
                                        Account_ID:req.body._ID_,
                                        Account_NAME:req.body.fullname1,
                                        Account_TYPE_ID:req.body.AdminType1,
                                        Account_EMAIL:req.body.email1
                                       
                                    }
                                    for (let [key, value] of Object.entries(result)) {
                                        details[key] = value
                                        console.log(`${key}: ${value}`);
                                    }
                                    await Admin.UpdateAdmin(details).then(resultIs=>{
                                        console.log(resultIs)
                                        res.render('includes/components/alert/alert-success2',
                                            {
                                                heading:'Done',
                                                message:req.body.fullname1+' updated.',
                                                message_bottom:'',
                                                success:true
                                            })
                                    })
                                }
                        })
                    }else{
                        res.render('includes/components/alert/alert-warning',{heading:'Email.',message:'Email is not available',message_bottom:'Please use another email',success:false})

                    }
                })
               
            }else{
                await Admin.Location(
                    req.body.AdminType1,
                    req.body.Province1,
                    req.body.Municipal1,
                    req.body.Barangay1).then(async result=>{
                        if(result==false){
                            res.render('includes/components/alert/alert-danger',{heading:'Script Modified.',message:'The file send to the server seems modified.',message_bottom:'Your request was recorded. Dont try again! Refresh this page!',success:false})
                        }else{
                            const  details = {
                                Account_ID:req.body._ID_,
                                Account_NAME:req.body.fullname1,
                                Account_TYPE_ID:req.body.AdminType1,
                                Account_EMAIL:req.body.email1
                               
                            }
                            for (let [key, value] of Object.entries(result)) {
                                details[key] = value
                                console.log(`${key}: ${value}`);
                            }
                            await Admin.UpdateAdmin(details).then( resultIs=>{
                                console.log(resultIs)
                                res.render('includes/components/alert/alert-success',
                                    {
                                        heading:'Link sent to ',
                                        message:'',
                                        message_bottom:'',
                                        success:true
                                    })
                            })
                        }
                    })
            }
        }
    })
module.exports = router;
