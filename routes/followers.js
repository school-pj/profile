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


/*内部結合を用いて、usersテーブルのidとrelationshipsテーブルのfollowing_idが一致する
ものをrenderで渡してあげて、ejs側で表示するようにする。なぜか⇒フォローする際にフォローしたユーザーIDがfollowing_idの中に
格納されるようになっているから。*/
router.get('/', function (req, res, next) {
  req.session.array_id = [];
  req.session.array_name = [];
  knex
      .from('users')
      .innerJoin('relationships', 'users.id', 'relationships.following_id')
      .then(function (rows) {
        //フォローされているIDをarray変数に格納し、ejs側でそのIDをもとに自分をフォローしているユーザーを表示する。
        for(var i = 0; i < rows.length; i++){
          req.session.array_id[i] = rows[i].following_id;
          req.session.array_name[i] = rows[i].user_name;
        }
        console.log(req.session.array_id);
        console.log(req.session.array_name);
        res.render('followers', {title: 'フォロワー一覧ページ', idList: req.session.array_id, nameList: req.session.array_name, user_name: req.session.user_name, user_id: req.session.user_id});
      })
      .catch(function (error) {
        console.error(error)
      });
});

router.post('/', function (req, res, next) {
  res.render("followers");

});


module.exports = router;
