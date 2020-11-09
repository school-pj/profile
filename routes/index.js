var express = require('express');
var router = express.Router();
var { authenticate } = require("./login");

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

//未ログイン時はSignupへ飛ぶ処理「Welcome Twiter」みたいな感じにする。

/* GET home page. */
router.get('/', function (req, res, next) {
  //usernameとpasswordに関しては、セッションから持ってくるように実装
  if (req.session.user_name) {
    knex
      .select()
      .from('users')
      .then(function (rows) {
        console.log("成功");
        console.log(rows);
        console.log(req.session.user_name + " " + req.session.password);
        res.render('index', { title: 'ProfileApp', user_name: req.session.user_name, password: req.session.password, contentList: rows, id: req.session.id });
      })
      .catch(function (error) {
        console.error(error)
      });
  } else {
    res.render('index', { title: 'Welcome to ProfileApp', user_name: req.session.user_name, password: req.session.password });
  }
});

router.post("/", (req, res, next) => {
  console.log("成功");
  const user_name = req.session.user_name;
  const password = req.session.password;
  const content = req.body.content;
  console.log(content);

  knex('users')
    .where({ user_name, password: user_name, password })
    .update({ content: content })
    .then(function (rows) {
      console.log(rows[0]);
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);

      res.redirect("/");
    });

});


//ログイン処理
router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("message"), user_name: req.session.user_name, password: req.session.password, id: req.session.id });
});

router.post("/login", authenticate());

//ログアウト処理
router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;