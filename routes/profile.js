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
//TODO : 下の行の:user_idは何を意味するか確認する←user_idという変数の値を持ってきている？？
router.get('/:user_id',
  function (req, res, next) {
    knex
      .select()
      .from('users')
      .then(function (rows) {
        res.render('profile', {
          user_name: req.session.user_name,
          contentList: rows,
          user_id: req.session.user_id
        });
      })
      .catch(function (error) {
        console.error(error)
      });
  });


//View My Profileを押下時の処理
router.post('/:user_id', function (req, res, next) {
  res.render("profile");
});


module.exports = router;