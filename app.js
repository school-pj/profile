const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionStore = new session.MemoryStore;

app.use(flash());
app.use(cookieParser('secret'));
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',require('./routes'));
require('./config/passport');

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
