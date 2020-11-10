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

router.get('/', function(req, res, next) {
  if (req.session.id) {
    //TODO:user_name名は変更するので不変のidでupdateするrowを指定すべき?
    //TODO:その場合シリアライズされたidをコード内で利用することになるので方法を調べる
    //TODO:セッション内にあるuser_nameを使ってupdateしたいrowをwhere検索することは可能
  res.render('setting', {title: 'アカウント設定' ,user_name:req.session.user_name});
}
  else {
        res.redirect("login");
  }
});


router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

    //バリデート処理
    //TODO:フラッシュメッセージが画面に出るように直す
  if(password !== confirm){
    res.render('setting',{
        title: "アカウント設定",
        pass: 'パスワードが一致しません'

    });
    return;
  }

  //TODO : セッションで持っているuser_nameのカラムを書き換えるupdateに直す
  //TODO : knexでのupdateの書き方と書き換えたいrowの検索の仕方をしらべる↓動かない
  knex.update({username, password: username, password })
      .into('users')
      .where('user_name',username)
      .then(function (rows) {
      //TODO:ログインページにリダイレクト、セッションは破棄する(セッションの破棄方法を調べる)
      res.redirect('/login');
      console.log(rows[0]);
    })
    .catch(function (error) {

      console.error(error)
    });
});


module.exports = router;