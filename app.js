const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signupRouter = require('./routes/signup');
const settingRouter = require('./routes/setting');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const followsRouter = require('./routes/follows');
const followersRouter = require('./routes/followers');
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const sessionStore = new session.MemoryStore;

const app = express();


app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));



app.use(flash());

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
app.use('/:user_id', profileRouter);
app.use('/follows', followsRouter);
app.use('/followers', followersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
