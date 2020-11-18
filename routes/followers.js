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
  res.render("followers");

});

router.post('/', function (req, res, next) {

});


module.exports = router;