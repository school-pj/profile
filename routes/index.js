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
  //フォロー数、フォロワー数を表示するため、内部結合を行うように修正を行う。
  //knex.js　内部結合のsql文
  //select * from users inner join relationships on users.id = relationships.id
  //例：knex.from('users').innerJoin('accounts', 'users.id', 'accounts.user_id')
  if (req.session.user_name) {
    // knex
    //   .select()
    //   .from('users')
      knex
      .from('users')
      .innerJoin('relationships','users.id','relationships.id')
      .then(function (rows) {
        req.session.followed_id = rows[0].followed_id;
        req.session.following_id = rows[0].following_id;
        res.render('index', { title: 'ProfileApp', user_name: req.session.user_name, contentList: rows, user_id: req.session.user_id, followed_id: req.session.followed_id, following_id: req.session.following_id});
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
  const user_id =  req.session.user_id;
  const content = req.body.content;

  knex('users')
    .where({ id: user_id,user_name: user_name})
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