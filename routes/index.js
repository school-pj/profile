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
//初期の状態では、relationshipsのほうには値が何も入っていないため、
//usersテーブル情報を何も取ってこれない状態になっている。
//そのため、内部結合で初期の状態でもusersテーブルの情報も持ってくるように実装が必要。
router.get('/', function (req, res, next) {
  if (req.session.user_name) {
    knex
      .from('users')
      .innerJoin('relationships','users.id','relationships.id')
      .then(function(rows){
        console.log(rows[0]);
        let count = 0;
        req.session.count = count;
        if(req.session.count >= 1){
          req.session.followed_id = rows[0].followed_id;
          req.session.following_id = rows[0].following_id;
        }else{
          req.session.followed_id = req.session.count;
          req.session.following_id = req.session.count;
        };
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