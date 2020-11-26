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
  req.session.array_user_id = [];
  req.session.array_user_name = [];
  //ログインしているユーザーIDをもとに、内部結合を行っていない。
  knex
    .from('users')
    .innerJoin('relationships', 'users.id', 'relationships.followed_id')
    .then(function (rows) {
      //フォローされているIDをarray変数に格納し、ejs側でそのIDをもとに自分をフォローしているユーザーを表示する。
      if (req.session.followed_id !== 0 && req.session.following_id !== 0) {
        for (var i = 0; i < rows.length; i++) {
          if (req.session.location == rows[i].following_id) {
            req.session.array_user_id[i] = rows[i].followed_id;
            req.session.array_user_name[i] = rows[i].user_name;
          }
        }
        res.render('followers', { title: 'followers', user_idList: req.session.array_user_id, user_nameList: req.session.array_user_name, user_name: req.session.user_name, user_id: req.session.user_id });
      } else {
        res.render('followers', { title: 'followers', user_idList: "", user_nameList: "", user_name: req.session.user_name, user_id: req.session.user_id });
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