// ・ユーザー名
// ・フォローユーザー数(フォローユーザー名一覧のリンク 
// ・フォロワーユーザー数(フォロワーユーザー名一覧のリンク
// ・自己紹介文
// ・フォローする処理、フォロー解除する処理
// ・ログイン時にログインしたユーザーのuserIDをセッションに保持しておく。

var express = require('express');
var router = express.Router();
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

//View My Profileを押下時の処理
router.get('/:id', function (req, res, next) {
  //res.render("/profile/user_id");
  knex
    .select()
    .from('users')
    .then(function(rows) {
      res.render('profile', {user_name: req.session.user_name,contentList: rows});
    })
    .catch(function(error) {
    console.error(error)
  });
});


//View My Profileを押下時の処理
router.post('/:id', function (req, res, next) {
  res.render("profile");
});


module.exports = router;