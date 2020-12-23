const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const session = require('express-session');
const sessionStore = new session.MemoryStore;
const User = require('../models/user.js');//モデル化したfindByIdメソッドの呼び出し

//実行した際に、app.jsでこのファイルが読み込まれ、このファイルのどの部分から実行すればよいかを明確にするため。
module.exports = function (app) {

  //　セッション情報設定                                                                                             
  app.use(session({
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: "true",
    secret: 'secret'
  }));
  //passport初期化
  app.use(passport.initialize());
  //req.userの更新
  app.use(passport.session());

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
        knex("users")
          .where({ user_name: user_name })
          .then(async function (rows) {
            if (rows != "") {
              const comparedPassword = await bcrypt.compare(password, rows[0].password);
              if (comparedPassword) {
                done(null, rows[0]);
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

  //サーバからクライアントに保存する処理
  //ログイン時(strategy実行時にしか実行されない)
  passport.serializeUser((user, done) => {
    console.log("sirialize");
    done(null, user.id);
  });


  //クライアントからサーバに復元する処理
  //セッションの有効期間中は常に機能する。req.userに値を入れる。
  passport.deserializeUser( async function (id, done) {
    console.log("deserialize");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  })
};