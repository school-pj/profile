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
    title: 'Setting',
    user_name: req.session.user_name,
    user_id: req.session.user_id
  });
});


router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

console.log("before_barridate");
    //バリデート処理
  if(password !== confirm){
    console.log("barridate");
    res.render('setting',{
        title: "Setting",
        pass: 'パスワードが一致しません'
    });
    return;
  }
  
  //セッションで持っているidのカラムを書き換えるupdateに直す
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