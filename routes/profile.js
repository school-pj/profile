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
//req.params⇒req.paramsオブジェクトの中で、パスに指定されたルート・パラメータの名前をそれぞれのキーとして設定されます。
//↑下の例だとルーティングでgetした際にuser_idに特定の数字が入っている。つまり[user_id: 数字]のような状態。
router.get('/:user_id',
  function (req, res, next) {
    console.log(req.params.user_id);
    //ユーザーID情報をもとにwhereで1列のレコードを取得し、取得したレコードから表示させたい情報を変数に格納してrenderで返す。
    // knex
    //   .from('users')
    //   .then(function (rows) {
    knex
      .from('users')
      .innerJoin('relationships', 'users.id', 'relationships.id')
      .then(function (rows) {
        if (rows[req.params.user_id - 1] === undefined) {
          knex("users")
            .where({ id: req.params.user_id })
            .then(function (rows) {
              console.log(rows);
              req.session.user_name = rows[0].user_name;
              if (rows[0].content === true) {
                console.log("何か値入りました！");
                req.session.content = rows[0].content;
              } else {
                console.log("nullが値として入りました！");
                req.session.content = " ";
              }
              const followed_id = 0;
              const following_id = 0;
              res.render('profile', { user_name: req.session.user_name, contentList: req.session.content, user_id: req.session.user_id, followed_id: followed_id, following_id: following_id });
            })
            .catch(function (error) {
              console.error(error)
            });
        } else {
          console.log(rows);
          req.session.user_name = rows[0].user_name;
          if (rows[0].content === true) {
            req.session.content = rows[0].content;
          } else {
            req.session.content = " ";
          }
          const followed_id = req.session.followed_id;
          const following_id = req.session.following_id;
          res.render('profile', { user_name: req.session.user_name, contentList: req.session.content, user_id: req.session.user_id, followed_id: followed_id, following_id: following_id });
        }
      })
      .catch(function (error) {
        console.error(error)
      });
  });


//View My Profileを押下時の処理
router.post('/:user_id', function (req, res, next) {
  res.render("profile", { user_name: req.session.user_name, user_id: req.session.user_id, });
});


module.exports = router;