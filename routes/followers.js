var express = require('express');
const { render } = require('../app');
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


//フォロワー数リンクを押下された時の処理
router.get('/', function (req, res, next) {
  req.session.array_id = [];
  req.session.array_name = [];
  //ログインしているユーザーIDをもとに、内部結合を行っていない。
  knex
      .from('users')
      .innerJoin('relationships', 'users.id', 'relationships.following_id')
      .then(function (rows) {
        if(req.session.followed_id !== 0 && req.session.following_id !== 0){
          //フォローされているIDをarray変数に格納し、ejs側でそのIDをもとに自分をフォローしているユーザーを表示する。
        for(var i = 0; i < rows.length; i++){
          req.session.array_id[i] = rows[i].following_id;
          req.session.array_name[i] = rows[i].user_name;
        }
        console.log(req.session.array_id);
        console.log(req.session.array_name);
        res.render('followers', {title: 'followers', idList: req.session.array_id, nameList: req.session.array_name, user_name: req.session.user_name, user_id: req.session.user_id});
        }else{
          res.render('followers', {title: 'followers', idList: " ", nameList: " ", user_name: req.session.user_name, user_id: req.session.user_id});
        }
      })
      .catch(function (error) {
        console.error(error)
      });
});

router.post('/', function (req, res, next) {
  res.render('followers');
});


module.exports = router;