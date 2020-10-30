var passport = require("passport");
var express = require('express');
var router = express.Router();
var LocalStrategy = require("passport-local").Strategy;
var initialize, authenticate, authorize;
var knex = require('knex')({
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
//username　localstrategyのdoneで渡されるキー情報
//serializeUserの第一引数に第一引数にわたる。
passport.serializeUser((user_name,done) => {
  console.log("シリアライズ");
  done(null,user_name); //この関数でシリアライズして保存される。
});


//クライアントからサーバに復元する処理
//デシリアライズは、シリアライズした情報をプログラムで処理できるように解凍する作業
passport.deserializeUser((user_name,done) => {
  console.log("デシリアライズ");
  done(null,user_name);
});

//ユーザー名とパスワードを利用した認証
passport.use("local-strategy",
  new LocalStrategy({
    usernameField: "username", //フォームの値
    passwordField: "password", //フォームの値
    passReqToCallback: true
  }, (req, user_name, password, done) => { //認証処理の記述し、完了した場合にdoneを呼び出す。

    //knex記述処理
    //SQL文：select * from user where username = username, password = password;
    knex("users")
      .where({ user_name, password: user_name, password })
      .then(function (rows) {
        //成功
        if (rows.length != 0) {
          req.session.user_name = user_name;
          req.session.password = password;
          console.log(user_name);
          done(null,user_name);
          //エラー(フラッシュメッセージ)
        } else {
          done(null, false, req.flash("message", "ユーザー名 または パスワード が間違っています。"));
        }
      });
  }));

initialize = function () {
  return [
    //expressに対するミドルウェア設定
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