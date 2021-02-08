var express = require('express');
var router = express.Router();
var jwt = require('../../function/jwt/jwt')
var Admin = require('../../function/admin/admin');
var Post = require('../../function/post/post');
var Post_location = require('../../function/post/postLoc');
var Post_link = require('../../function/post/postlink');
var multer = require('multer')
var UUID = require('../../function/jwt/uuid')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/post_images/');
    },
    filename: function (req, file, cb) {
        const uuid = UUID.generate(file.originalname)
        var str = file.originalname
        var res = str.split(".");
        cb(null, uuid + '-' + Date.now().toString() + '.' + res[1]);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
var upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter
    }
)
var cpUpload = upload.fields([{ name: 'photos', maxCount: 50 }])
/* GET home page. */
router.route('/')
    .get(Admin.checkToken, (req, res, next) => {
        res.render('includes/base/base', {
            title: 'Post',
            authorized: true,
            Account_ID: req.decoded.Account_ID,
            Account_NAME: req.decoded.Account_NAME,
            Account_USERNAME: req.decoded.Account_USERNAME,
            Account_TYPE_ID: req.decoded.Account_TYPE_ID,
            Account_EMAIL: req.decoded.Account_EMAIL,
            Account_Province: req.decoded.Account_Province,
            Account_Municipal: req.decoded.Account_Municipal,
            Account_Barangay: req.decoded.Account_Barangay,
            Account_ISVERIFY: req.decoded.Account_ISVERIFY,
            route: 'POST'
        });
    })
    .post(Admin.checkToken, (req, res, next) => {
        res.render('includes/post/basePost', {
            title: 'Post',
            authorized: true,
            Account_ID: req.decoded.Account_ID,
            Account_NAME: req.decoded.Account_NAME,
            Account_USERNAME: req.decoded.Account_USERNAME,
            Account_TYPE_ID: req.decoded.Account_TYPE_ID,
            Account_EMAIL: req.decoded.Account_EMAIL,
            Account_Province: req.decoded.Account_Province,
            Account_Municipal: req.decoded.Account_Municipal,
            Account_Barangay: req.decoded.Account_Barangay,
            Account_ISVERIFY: req.decoded.Account_ISVERIFY
        });
    })
router.route('/post-box')
    .post(Admin.checkToken, (req, res, next) => {
        res.render('includes/post/postbox', {
            title: 'Post',
            authorized: true,
            Account_ID: req.decoded.Account_ID,
            Account_NAME: req.decoded.Account_NAME,
            Account_USERNAME: req.decoded.Account_USERNAME,
            Account_TYPE_ID: req.decoded.Account_TYPE_ID,
            Account_EMAIL: req.decoded.Account_EMAIL,
            Account_Province: req.decoded.Account_Province,
            Account_Municipal: req.decoded.Account_Municipal,
            Account_Barangay: req.decoded.Account_Barangay,
            Account_ISVERIFY: req.decoded.Account_ISVERIFY
        });
    })
router.route('/a')
    .post(Admin.checkToken, (req, res, next) => {
        let body = req.body;
        let offset = body.offset;
        let keyword = body.keyword;
        let sort = body.sort;
        console.log(body.offset)
        Post.findAll(keyword, offset).then(d => {
            res.json(d)
        })
    })
router.route('/c')
    .post(Admin.checkToken, (req, res, next) => {
        try {
            cpUpload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log(err)
                } else if (err) {
                    console.log(err)
                }

                req.check('body', 'Cannot be empty').not().isEmpty()
                req.check('alert', 'Select at least (1) alert type.').not().isEmpty().isIn(['none',
                    'yellow',
                    'orange',
                    'red']).isLength({ min: 3, max: 45 })
                req.check('post_type', 'Cannot be empty').not().isEmpty()
                var Errors = req.validationErrors();
                var files = req.files['photos']
                if (Errors) {
                    console.log(Errors[0])
                    Post_link.rem_file(files).then(d => {
                        res.status(500).send(Errors[0])
                    })
                } else {
                    var body = req.body;
                    let post = {
                        ID: null,
                        BODY: body.body,
                        _DATE: new Date().toISOString().
                            replace(/T/, ' ').
                            replace(/\..+/, ''),
                        ALERT_TYPE: body.alert,
                        POST_TYPE: body.post_type,
                        ADMIN_ID: req.decoded.Account_ID
                    }
                    console.log(post)
                    var loc = ''
                    try {
                        loc = JSON.parse(body.location)
                    } catch (error) {
                        loc = undefined
                        console.log(error)
                    }
                    if (typeof loc == 'undefined' || loc.length == 0) {
                        Post_link.rem_file(files).then(d => {
                            res.status(500).send({
                                msg: 'Select at least (1) one location.',
                                param: 'location'
                            })
                        })
                    } else {
                        Post.create(post).then(async data => {
                            if (data) {
                                if (data.affectedRows == 1) {
                                    await Post_location.Location_arr(loc, req.decoded.Account_Province, data.insertId).then(async location => {
                                        if (location) {
                                            await Post_location.create(location).then(pl => {
                                                if (pl) {
                                                    if (pl.affectedRows >= 1) {
                                                        Post_link.link_arr(files, data.insertId).then(file => {
                                                            console.log(file)
                                                            if (file) {
                                                                if (file.l == 0) {
                                                                    res.sendStatus(200)
                                                                } else {
                                                                    Post_link.create(file).then(pla => {
                                                                        if (pla) {
                                                                            if (pla.affectedRows >= 1) {
                                                                                res.sendStatus(200)
                                                                            } else {
                                                                                Post.remove(data.insertId).then(r => {
                                                                                    Post_link.rem_file(files).then(d => {
                                                                                        res.status(500).send({
                                                                                            msg: 'File not supported.',
                                                                                            param: 'Files'
                                                                                        })
                                                                                    })
                                                                                })
                                                                            }
                                                                        } else {
                                                                            Post.remove(data.insertId).then(r => {
                                                                                Post_link.rem_file(files).then(d => {
                                                                                    res.status(500).send({
                                                                                        msg: 'File not supported.',
                                                                                        param: 'Files'
                                                                                    })
                                                                                })
                                                                            })
                                                                        }
                                                                    })
                                                                }

                                                            } else {
                                                                Post.remove(data.insertId).then(r => {
                                                                    Post_link.rem_file(files).then(d => {
                                                                        res.status(500).send({
                                                                            msg: 'File not supported.',
                                                                            param: 'Files'
                                                                        })
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        Post.remove(data.insertId).then(r => {
                                                            Post_link.rem_file(files).then(d => {
                                                                res.status(500).send({
                                                                    msg: 'Select at least (1) one location.',
                                                                    param: 'location'
                                                                })
                                                            })
                                                        })
                                                    }
                                                } else {
                                                    Post.remove(data.insertId).then(r => {
                                                        Post_link.rem_file(files).then(d => {
                                                            res.status(500).send({
                                                                msg: 'Select at least (1) one location.',
                                                                param: 'location'
                                                            })
                                                        })
                                                    })
                                                }

                                            })
                                        } else {
                                            Post.remove(data.insertId).then(r => {
                                                Post_link.rem_file(files).then(d => {
                                                    res.status(500).send({
                                                        msg: 'Select at least (1) one location.',
                                                        param: 'location'
                                                    })
                                                })
                                            })
                                        }

                                    })
                                } else {
                                    Post_link.rem_file(files).then(d => {
                                        res.status(500).send({
                                            msg: 'Cannot be empty.',
                                            param: 'body'
                                        })
                                    })
                                }
                            } else {
                                Post_link.rem_file(files).then(d => {
                                    res.status(500).send({
                                        msg: 'Cannot be empty.',
                                        param: 'body'
                                    })
                                })
                            }

                        })
                    }
                }
            })
        } catch (error) {

        }

    })
router.route('/w/:id')
    .post(Admin.checkToken, (req, res, next) => {
        try {
            let ID = req.params.id
            console.log(ID, req.body.id)
            Post.find(ID).then(post => {
                Admin.info(post.ADMIN_ID).then(user => {
                    console.log(post)
                    res.render('includes/post/content', {
                        id: post[0].ID,
                        body: post[0].BODY,
                        alerttype: post[0].ALERT_TYPE,
                        post_type: post[0].POST_TYPE,
                        user: user,
                        locations: post[0].js,
                        link: post[0].link
                    })
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }

    })
    .delete(Admin.checkToken, (req, res, next) => {

    })
module.exports = router;
