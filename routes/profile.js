var express = require('express');
var router = express.Router();
const itemRouter = express.Router({mergeParams: true})
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
router.get('/:user_id',
 function (req, res, next) {
  //res.render("/profile/user_id");
  knex
    .select()
    .from('users')
    .then(function(rows) {
      res.render('profile', {user_name: req.session.user_name,contentList: rows});
    })
    .catch(function(error) {
    console.error(error)
  });
});


//View My Profileを押下時の処理
router.post('/:user_id', function (req, res, next) {
  res.render("profile");
});


module.exports = router;