var express = require('express');
var router = express.Router();
var jwt = require('../../function/jwt/jwt')
var Message = require('../../function/message/message')
var Thread = require('../../function/message/thread')
var Thread_participant = require('../../function/message/thread_participant')
var Admin = require('../../function/admin/admin');
var Chat = require('../../function/chat/admin_chat');
var app = require('../../app');
var Admin = require('../../function/admin/admin')
/* GET home page. */
router.route('/')
.get( Admin.checkToken, function(req, res, next) {
    //include ./../message/messageForm/body
    res.render('includes/message/messageForm/body', { title: 'Express' ,authorized:true,
    Account_ID:req.decoded.Account_ID,
    Account_NAME:req.decoded.Account_NAME,
    Account_USERNAME:req.decoded.Account_USERNAME,
    Account_TYPE_ID:req.decoded.Account_TYPE_ID,
    Account_EMAIL:req.decoded.Account_EMAIL,
    Account_LOCATION:req.decoded.Account_LOCATION,
    Account_ISVERIFY:req.decoded.Account_ISVERIFY});
})
.post(Admin.checkToken, function(req, res, next) {
    //include ./../message/messageForm/body
    res.render('includes/message/messageForm/body', { title: 'Express' ,authorized:true,
    Account_ID:req.decoded.Account_ID,
    Account_NAME:req.decoded.Account_NAME,
    Account_USERNAME:req.decoded.Account_USERNAME,
    Account_TYPE_ID:req.decoded.Account_TYPE_ID,
    Account_EMAIL:req.decoded.Account_EMAIL,
    Account_LOCATION:req.decoded.Account_LOCATION,
    Account_ISVERIFY:req.decoded.Account_ISVERIFY});
});
router.route('/chat-thread')
.post( Admin.checkToken, function(req, res, next) {
    let OFFSET = req.body.OFFSET
    Thread_participant.get(req.decoded.Account_ID,OFFSET).then(thread=>{
        res.send(thread)
    }).catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
});
router.get('/chat-thread-messages', Admin.checkToken,Chat.getMessageByThread, function(req, res, next) {
    //res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
});
router.route('/chat-box')
.post(Admin.checkToken,function(req,res,next){
    let id = req.body.id;
    Admin.info(id).then(user=>{
        res.render('includes/message/chat_box_popUp', 
        {
            title: 'Express' ,authorized:true,
            Account_ID:user.Account_ID,
            Account_NAME:user.Account_NAME,
            Account_USERNAME:user.Account_USERNAME,
            Account_TYPE_ID:user.Account_TYPE_ID,
            Account_EMAIL:user.Account_EMAIL,
            Account_LOCATION:user.Account_LOCATION,
            Account_ISVERIFY:user.Account_ISVERIFY
        })
    }).catch(err=>{
        console.log(err)
    })
   
})
router.route('/chat-content')
.post(Admin.checkToken,function(req,res,next){
    let id = req.body.id;
    Admin.info(id).then(user=>{
        res.render('includes/message/messageForm/content', 
        {
            title: 'Express' ,authorized:true,
            Account_ID:user.Account_ID,
            Account_NAME:user.Account_NAME,
            Account_USERNAME:user.Account_USERNAME,
            Account_TYPE_ID:user.Account_TYPE_ID,
            Account_EMAIL:user.Account_EMAIL,
            Account_LOCATION:user.Account_LOCATION,
            Account_ISVERIFY:user.Account_ISVERIFY
        })
    }).catch(err=>{
        console.log(err)
    })
   
})
router.route('/t')
.post( Admin.checkToken,function(req,res,next){
    let TO_USER = req.body.TO_USER
    let USER_ID = req.decoded.Account_ID
    let OFFSET = req.body.OFFSET
    console.log('Account_ID' , req.decoded.Account_ID,TO_USER, USER_ID, OFFSET)
    Thread_participant.find(USER_ID,TO_USER).then(Thread_id=>{
        Message.findOnMessageAndThreadParticipant(Thread_id[0].THREAD_ID, OFFSET ).then(messages=>{
            res.render('includes/components/message/messages',{messages:messages,me:req.decoded.Account_ID})
        }).catch(err=>{
            console.log(err)
            res.send(500)
        }) 
    }).catch(err=>{
            console.log(err)
            res.sendStatus(500)
        })
})
module.exports = router;
