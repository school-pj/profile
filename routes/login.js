const passport = require("passport");
const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
let initialize, authenticate, authorize;
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'profileapp'
  },
  useNullAsDefault: true
});


//サーバからクライアントに保存する処理
passport.serializeUser((user_name, done) => {
  done(null, user_name);
});


//クライアントからサーバに復元する処理
passport.deserializeUser((user_name, done) => {
  done(null, user_name);
});

//ユーザー名とパスワードを利用した認証
passport.use(
  "local-strategy",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, user_name, password, done) => {
      req.session.password = req.body.password;
      knex("users")
        .where({ user_name: user_name })
        .then(async function (rows) {
          if (rows != "") {
            const comparedPassword = await bcrypt.compare(password, rows[0].password);
            if (comparedPassword) {
              req.session.user_name = user_name;
              req.session.user_id = rows[0].id;
              done(null, user_name);
            } else {
              done(
                null,
                false,
                req.flash(
                  "message",
                  "The user name or password is incorrect。"
                )
              )
            };
          } else {
            done(
              null,
              false,
              req.flash(
                "message",
                "The user name or password is incorrect."
              )
            );
          }
        });
    }
  )
);

initialize = function () {
  return [
    passport.initialize(),
    passport.session()
  ];
};

//認証成功時処理
authenticate = function () {
  return passport.authenticate(
    "local-strategy", {
    successRedirect: "/",
    failureRedirect: "/login"
  }
  );
};




module.exports = {
  initialize,
  authenticate,
  authorize,
  router
};