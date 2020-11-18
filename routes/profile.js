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
  req.session.location = req.params.user_id;
  req.session.isfollow = false;
  knex("relationships")
    .where({ followed_id: req.session.user_id, following_id: req.session.location })
    .then(function (rows) {
      if(rows.length >= 1){
        req.session.isfollow = true;
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
        page_location: req.session.location,
        isotherspage: req.session.user_id != req.session.location,
        isfollow:req.session.isfollow,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

//フォローorフォロー解除ボタン押下時の処理
router.post("/:user_id", (req, res, next) => {
  const followed_id = req.session.user_id;
  const following_id = req.session.location;
  if (req.session.isfollow) {
    knex("relationships")
      .where({ followed_id: followed_id, following_id: following_id })
      .delete()
      .then(function (rows) {
        res.redirect(`/users/${req.session.location}`);
      })
      .catch(function (error) {
        console.error(error);
        res.redirect(`/users/${req.session.location}`);
      });
  } else {
    knex("relationships")
      .insert({ followed_id: followed_id, following_id: following_id })
      .then(function (rows) {
        res.redirect(`/users/${req.session.location}`);
      })
      .catch(function (error) {
        console.error(error);
        res.redirect(`/users/${req.session.location}`);
      });
  }
});
module.exports = router;
