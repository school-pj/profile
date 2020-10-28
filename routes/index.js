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
  //usernameとpasswordに関しては、セッションから持ってくるように実装
  // var content = req.body.content;
  if (req.session.user_name) {
    res.render('index', { title: 'ProfileApp' , user_name: req.session.user_name });

  //   knex.insert({ content: content })
  //     .into('users')
  //     .then(function (rows) {
  //       console.log(rows[0]);
  //     })
  //     .catch(function (error) {
  //       console.error(error)
  //     });
  // } else {
  //   res.redirect("login");
   }
});

router.post("/", (req,res,next) => {
  let content = req.body.content;

    knex.insert({ content: content })
      .into('users')
      .then(function (rows) {
        console.log(rows[0]);
        res.render("/");
      })
      .catch(function (error) {
        console.error(error);
        res.render("/");
      });

});



router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("message") });
});

router.post("/login", authenticate());


// //View My Profileを押下された時の処理
// router.post('/users/user_id', function (req, res, next) {
//   res.render("/user_id")
// });

// //フォロー数リンクを押下された時の処理
// router.post('/users/user_id/follows', function (req, res, next) {
//   var user = req.body.title;
//   knex.insert({ title, content: title, content })
//     .into('user')
//     .then(function (rows) {
//       console.log(rows[0]);
//     })
//     .catch(function (error) {
//       console.error(error)
//     });
//   res.redirect('/');
// });

// //フォロワー数リンクを押下された時の処理
// router.get('/users/user_id/followers', function (req, res, next) {
//   knex
//     .select()
//     .from('task')
//     .then(function (rows) {
//       res.render("todo", { title: "TODOアプリ", taskList: rows })
//       console.log(rows);
//     })
//     .catch(function (error) {
//       console.error(error)
//     });
// });

module.exports = router;