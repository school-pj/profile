var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
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
  res.render('signup', {
    title: 'Sing up',
    user_name:req.session.user_name
  });
});

router.post('/', async function(req, res, next) {
  var user_name = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;

  //バリデート処理
  if(password !== confirm){
    res.render('signup',{
        title: "Sign up",
        pass: 'Password is incorrect'
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  knex.insert({ user_name: user_name, password: hashedPassword })
  .into('users')
  .then(function (rows) {
      //メインページにリダイレクト
      res.redirect('/');
      console.log(rows[0]);
    })

    .catch(function (error) {

      console.error(error)
    });
  
});



module.exports = router;