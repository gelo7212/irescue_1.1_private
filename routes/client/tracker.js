var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('includes/report/user_report/base', { title: 'Express' });
});

module.exports = router;
