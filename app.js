var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var session = require('express-session')
var helmet = require('helmet')
var hpp = require('hpp'); 
var bodyParser = require('body-parser')
app.use(bodyParser.json());
const  expressvalidator= require('express-validator');

//var proxy = require('http-proxy-middleware');
app.use(hpp()); 
app.use(helmet())
app.disable('x-powered-by')
app.use(helmet.noCache({noEtag: true})); //set Cache-Control header
app.use(helmet.noSniff());    // set X-Content-Type-Options header
app.use(helmet.frameguard()); // set X-Frame-Options header
app.use(helmet.xssFilter()); 
app.use(session({name: 'SESS_ID', secret: 'secret@is!the@keyword)(@', cookie: { maxAge: 60000*5 },resave: true,saveUninitialized: true}))
app.use(expressvalidator())

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/auth/admin')
var login = require('./routes/auth/login');
var auth = require('./routes/auth/auth');
var signup = require('./routes/auth/signup');
var dashboard = require('./routes/dashboard/dashboard');
var client = require('./routes/client/client');
var account = require('./routes/account/account');
var message = require('./routes/message/admin');
var map = require('./routes/map/map');
var report = require('./routes/client/report');
var tracker = require('./routes/client/tracker');
var Log = require('./function/logger/log')
var jwt = require('./function/jwt/jwt')
let post = require('./routes/post/post');
const io = require('socket.io')();

var databaseHelper = require('./function/databaseHelper/databaseHelper')
// view engine setup
var to

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret@is!the@keyword)(@'));
app.use(express.static(path.join(__dirname, 'public')));
var requests = [];
var requestTrimThreshold = 5000;
var requestTrimSize = 4000;
/* app.use(function(req, res, next) {
  requests.push(Date.now());
  if (requests.length > requestTrimThreshold) {
    requests = requests.slice(0, requests.length - requestTrimSize);
  }
  console.log('requset/second ',requests.length)
  next()
}); */
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/user/a/:id', usersRouter);
app.use('/dashboard', dashboard);
app.use('/client', client);
app.use('/message', message);
app.use('/message/chat-thread', message);
app.use('/message/chat-thread-messages', message);
app.use('/report', report);
app.use('/tracker', tracker);
app.use('/login', login);
app.use('/account', account);
app.use('/Administrator', admin);
app.use('/Administrator/setup', admin);
app.use('/Administrator/setup/:token', admin);
app.use('/Administrator/setup/:token/verify/:code', admin);
app.use('/Administrator/resend-code/:token', admin);
app.use('/Administrator/account/:token', admin);
app.use('/Map',map)
app.use('/login/facebook', login);
app.use('/auth/facebook/callback', login);
app.use('/auth', auth);
app.use('/auth/user', auth);
app.use('/page', auth);
app.use('/post', post);
app.io = io
app.jwt= jwt
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(err.status != 404){
    Log.error({
      level: 'error',
      message: err.message +' '+ Date.now()
    });
  }
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
