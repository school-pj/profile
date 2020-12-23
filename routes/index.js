const express = require('express');
const router = express.Router();

const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.use('/users', require('./users'));
router.use('/signup', require('./signup'));
router.use('/setting', require('./setting'));
router.use('/login', require('./login'));
router.use('/:user_id', require('./profile'));
router.use('/follows', require('./follows'));
router.use('/followers', require('./followers'));

//req.user.〇〇でDBから値をとってくることが可能！//
/* GET home page. */
router.get("/", function (req, res, next) {
  req.session.array_user_followed_id = [];
  req.session.array_user_following_id = [];
  req.session.location = req.session.user_id;
  if (req.isAuthenticated()) {
    knex.from("users").then(function (rows) {
      const content = rows;

      knex
        .from("users")
        .innerJoin("relationships", "users.id", "relationships.followed_id")
        .then(function (rows) {
          if (rows[req.user.id - 1] === undefined) {
            req.session.followed_id = 0;
            req.session.following_id = 0;
            console.log(req.user.id);
            res.render("index", {
              title: "ProfileApp",
              user_name: req.user.user_name,
              contentList: content,
              user_id: req.user.id,
              followed_id: req.session.followed_id,
              following_id: req.session.following_id,
            });
          } else {
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
                        req.session.array_user_following_id = rows[i].following_id;
                        req.session.count_followed_id++;
                      }
                    }
                    res.render("index", {
                      title: "ProfileApp",
                      user_name: req.user.user_name,
                      contentList: content,
                      user_id: req.user.id,
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
  } else {
    res.render("index", {
      title: "Welcome to ProfileApp",
      user_name: req.session.user_name,
      user_id: req.session.user_id,
    });
  }
});
router.post("/", (req, res, next) => {
  const user_name = req.user.user_name;
  const user_id = req.user.id;
  const content = req.body.content;
  knex("users")
    .where({ id: user_id, user_name: user_name })
    .update({ content: content })
    .then(function (rows) {
      res.redirect("/");
    })
    .catch(function (error) {
      console.error(error);
      res.redirect("/");
    });
});

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
