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
  if (req.session.user_name) {
    //TODO : sessionにidが今のところないので、dbの更新すべきデータが逆引きできない？
  res.render('setting', {title: 'アカウント設定' , user_name: req.session.user_name});
    console.log(user_name);
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
  if(password !== confirm){
    res.render('setting',{
        title: "アカウント設定",
        pass: 'パスワードが一致しません'

    });
    return;
  }

  //TODO : セッションで持っているidのカラムを書き換えるupdateに直す
  knex.insert({ username, password: username, password }).into('users').then(function (rows) {
      //セッティングページにリダイレクト
      res.redirect('/setting');
      console.log(rows[0]);
    })
    .catch(function (error) {

      console.error(error)
    });
});


module.exports = router;