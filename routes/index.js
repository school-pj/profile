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


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user_name) {
    knex
      .select()
      .from('users')
      .then(function (rows) {
        res.render('index', { title: 'ProfileApp', user_name: req.session.user_name, contentList: rows, user_id: req.session.user_id});
      })
      .catch(function (error) {
        console.error(error)
      });
  } else {
    res.render('index', { title: 'Welcome to ProfileApp', user_name: req.session.user_name,user_id: req.session.user_id });
  }
});

router.post("/", (req, res, next) => {
  const user_name = req.session.user_name;
  const content = req.body.content;

  knex('users')
    .where({ user_name: user_name})
    .update({ content: content })
    .then(function (rows) {
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);
      res.redirect("/");
    });

});


//ログイン処理
router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("message"), user_name: req.session.user_name});
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