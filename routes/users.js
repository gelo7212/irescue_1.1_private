var express = require('express');
var router = express.Router();

var Admin = require('../function/admin/admin');
var Client = require('../function/client/user');
/* GET users listing. */

router.route('/')
.get(async function(req, res, next) {
   // console.log('Worker @',`${process.pid}`);
    Admin.users('Angelo Mendoza',1).then(result=>{
        res.json(result)
    })
})
.post(Admin.checkToken, function(req, res, next) {
    const body = req.body;
    Admin.users(body.seachBy,body.offset).then(result=>{
         res.json(result)
    })
})
router.route('/admin')
.post(Admin.checkToken, function(req, res, next) {
    const body = req.body;
    Admin.users(body.seachBy,body.offset).then(result=>{
         res.json(result)
    })
})

router.route('/admin/:id')
.get(async function(req, res, next) {
   // console.log('Worker @',`${process.pid}`);
    console.log(req.params)
    Admin.info(req.params.id).then(result=>{
        res.json(result)
    })
})
router.route('/client')
.post(Admin.checkToken, function(req, res, next) {
    const body = req.body;
    Client.findAll(body.seachBy,body.offset).then(result=>{
         res.json(result)
    })
})
router.route('/client/:id')
.post(Admin.checkToken, function(req, res, next) {
    const body = req.body;
    Client.find(req.params.id).then(result=>{
        res.json(result)
    })
})
module.exports = router;
