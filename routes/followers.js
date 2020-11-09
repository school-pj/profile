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


router.get('/followers', function (req, res, next) {
  res.render('followers', {
    title: 'フォロワー一覧ページ'
  });
});

router.post('/followers', function (req, res, next) {


});


module.exports = router;