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



router.get('/', function(req, res, next) {
  res.render('setting', {
    title: 'アカウント設定'
  });
});


router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;


    //バリデート処理
  if(password !== confirm){
    res.render('signup',{
        title: "アカウント設定",
        pass: 'パスワードが一致しません'
    });
    return;
  }
  
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