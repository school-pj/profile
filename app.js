var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
//var passport = require('passport'); // 追記

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup'); 
var settingRouter = require('./routes/setting');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var followsRouter = require('./routes/follows');
var followersRouter = require('./routes/followers');
var flash = require("connect-flash");//メッセージ表示
var bodyParser = require("body-parser");//認証情報の保存
var cookieParser = require('cookie-parser');//認証情報の保存
var session = require('express-session');//認証情報の保存
var passport = require('passport');//passport.jsのコア機能
var sessionStore = new session.MemoryStore;

var app = express();

//　セッション情報設定 追加部分ここから                                                                                               
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 30*24*60*60*1000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(...loginRouter.initialize());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/setting', settingRouter);  
//app.use('/login', loginRouter);
app.use('/:user_id', profileRouter);
app.use('/follows', followsRouter);
app.use('/followers', followersRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
