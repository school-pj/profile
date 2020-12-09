const express = require('express');
const router = express.Router();
const { authenticate } = require("./login");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
/* GET home page. */
router.get("/", function (req, res, next) {
  req.session.array_user_followed_id = [];
  req.session.array_user_following_id = [];
  req.session.location = req.session.user_id;
  if (req.isAuthenticated()) {
    //新規登録したユーザーのfollowed_id,following_idに初期値0を持たせる処理(signupで新規登録時に実装する形にしたい)
    knex.from("users").then(function (rows) {
      const content = rows;
      knex.from("users").then(function (rows) {
        const content = rows;

        knex
          .from("users")
          .innerJoin("relationships", "users.id", "relationships.followed_id")
          .then(function (rows) {
            if (rows[req.session.user_id - 1] === undefined) {
              req.session.followed_id = 0;
              req.session.following_id = 0;
              res.render("index", {
                title: "ProfileApp",
                user_name: req.session.user_name,
                contentList: content,
                user_id: req.session.user_id,
                followed_id: req.session.followed_id,
                following_id: req.session.following_id,
              });
            } else {
              //フォロワー数カウント処理
              req.session.count_following_id = 0;
              req.session.count_followed_id = 0;
              knex
                .from("users")
                .innerJoin(
                  "relationships",
                  "users.id",
                  "relationships.followed_id"
                )
                .then(function (rows) {
                  for (let i = 0; i < rows.length; i++) {
                    if (req.session.location == rows[i].following_id) {
                      req.session.array_user_followed_id = rows[i].followed_id;
                      req.session.count_following_id++;
                    }
                  }
                  //フォロー数カウント処理
                  knex
                    .from("users")
                    .innerJoin(
                      "relationships",
                      "users.id",
                      "relationships.following_id"
                    )
                    .then(function (rows) {
                      for (let i = 0; i < rows.length; i++) {
                        if (req.session.location == rows[i].followed_id) {
                          req.session.array_user_following_id =
                            rows[i].following_id;
                          req.session.count_followed_id++;
                        }
                      }
                      res.render("index", {
                        title: "ProfileApp",
                        user_name: req.session.user_name,
                        contentList: content,
                        user_id: req.session.user_id,
                        followed_id: req.session.count_followed_id,
                        following_id: req.session.count_following_id,
                      });
                    });
                });
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      });
    });
  } else {
    res.render("index", {
      title: "Welcome to ProfileApp",
      user_name: req.session.user_name,
      user_id: req.session.user_id,
    });
  }
});
router.post("/", (req, res, next) => {
  const user_name = req.session.user_name;
  const user_id = req.session.user_id;
  const content = req.body.content;
  console.log(content);
  console.log(user_name);
  console.log(user_id);
  knex("users")
    .where({ id: user_id, user_name: user_name })
    .update({ content: content })
    .then(function (rows) {
      console.log(rows);
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);
      res.redirect("/");
    });
});
//ログイン処理
router.get("/login", (req, res, next) => {
  res.render("login", {
    message: req.flash("message"),
    user_name: req.session.user_name,
    user_id: req.session.user_id,
  });
});
router.post("/login", authenticate());
//ログアウト処理
router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
module.exports = router;
