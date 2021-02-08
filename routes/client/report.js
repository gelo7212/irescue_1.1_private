var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('includes/base/base', { 
    title: 'Express',
    route:  'REPORT'
  });
}).post('/', function(req, res, next) {
  res.render('includes/report/user_report/base', { 
    title: 'Express',
    route:  'REPORT'
  });
});

module.exports = router;
