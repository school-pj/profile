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

//View My Profileを押下時の処理
router.get("/:user_id", function (req, res, next) {
  req.session.array_id = [];
  var location = req.url.slice(-1);
  console.log(req.session.user_id);
  console.log(location);
  console.log(req.session.user_id != location);
  knex
    .from("users")
    .innerJoin("relationships", "users.id", "relationships.followed_id")
    .then(function (rows) {
      for (var i = 0; i < rows.length; i++) {
        req.session.array_id[i] = rows[i].following_id;
      }
    });
  knex
    .select()
    .from("users")
    .then(function (rows) {
      res.render("profile", {
        user_name: req.session.user_name,
        contentList: rows,
        user_id: req.session.user_id,
        isotherspage: req.session.user_id != location,
        isfollow: req.session.array_id.includes(location),
      });
    })

    .catch(function (error) {
      console.error(error);
    });
});

//View My Profileを押下時の処理
router.post("/:user_id", function (req, res, next) {
  res.render("profile");
});

module.exports = router;
