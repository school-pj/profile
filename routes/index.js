/*
ログイン済み
ユーザー名
自分のプロフィールページへのリンク(View My Profile
フォローユーザー数(フォローユーザー名一覧のリンク
フォロワーユーザー数(フォロワーユーザー名一覧のリンク
自己紹介文
自己紹介文入力フォーム
|-投稿(更新)ボタン(Update
未ログイン
サインアップページへの遷移ボタン(SignUp
*/


var express = require('express');
var router = express.Router();

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todoapp'
  },
  useNullAsDefault: true
});

/* GET home page. */
router.get('/', function (req, res, next) { 
  //usernameとpasswordに関しては、セッションから持ってくるように実装
  var username = req.body.user; //いったんこのまま
  var password = req.body.password;//同様
  var content = req.body.content;
  res.render('index', { title: 'ProfileApp' } ,{user});

  knex.insert({ content: content })
  .into('users')
   .then(function (rows) {
     console.log(rows[0]);
   })
   .catch(function (error) {
     console.error(error)
   });
});

//View My Profileを押下された時の処理
router.post('/users/user_id', function (req, res, next) {
  res.render("/user_id")
});

//フォロー数リンクを押下された時の処理
router.post('/users/user_id/follows', function (req, res, next) {
  var user = req.body.title;
  knex.insert({ title, content: title, content })
  .into('user')
  .then(function (rows) {
    console.log(rows[0]);
  })
  .catch(function (error) {
    console.error(error)
  });
  res.redirect('/');
});

//フォロワー数リンクを押下された時の処理
router.get('/users/user_id/followers', function(req, res, next) {
  knex
  .select()
  .from('task')
  //.then(res.render('todo', function(rows) {
  .then(function(rows) {
    res.render("todo",{title: "TODOアプリ",taskList: rows})
    console.log(rows);
    // title: "TODOアプリ"
    // taskList: rows
  })
  .catch(function(error) {
    console.error(error)
  });
});


// router.post('/todo', function (req, res, next) {
//   var id = req.body.id;
//   //var query = DELETE FROM task WHERE id=?;
//   knex('task')
//   .where('id',id)
//   .del()
//   .then(function(rows){
//     console.log(rows);
//     res.redirect('/todo');
//   })
//   .catch(function(error) {
//     console.error(error)
//   });
// });


module.exports = router;