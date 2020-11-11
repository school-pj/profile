var express = require("express");
var router = express.Router();
var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "profileapp",
  },
  useNullAsDefault: true,
});

//TODO_1 userのデータを全件取得する
//TODO_2 rowsの[0](id)と[1](user_name)を使ってリンクとテキストを生成する(for文)
//TODO_3 ejs側に生成したリンクテキストを配置
router.get("/", function (req, res, next) {
  knex
    .select()
    .from("users")
    .then(function (rows) {
      res.render("users", {
        title: "All Users",
        user_name: req.session.user_name,
        userlist: rows 
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});
module.exports = router;
