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
  if (req.session.id) {
  res.render('setting', {message: req.flash("message") , title: 'アカウント設定' ,user_name:req.session.user_name});
}
  else {
        res.redirect("login");
  }
});


router.post('/', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;
  var user_id = req.session.user_id;

    //バリデート処理
    //TODO:フラッシュメッセージが画面に出るように直す
  if(password !== confirm){
    req.flash("message",'パスワードが一致しません'),
    console.log(req.flash("message"));
    res.render('setting',{
        title: "アカウント設定",
        message: req.flash("message"),
        user_name: username
    })
    return;
  }

  knex('users')
      .where({id:user_id})
      .update({user_name:username,password:password})
      .then(function (rows) {
      res.redirect('/logout');
      console.log(rows[0]);
    })
    .catch(function (error) {
      console.error(error)
    });
});
module.exports = router;