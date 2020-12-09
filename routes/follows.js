const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/", function (req, res, next) {
  req.session.array_user_id = [];
  req.session.array_user_name = [];
  knex
    .from("users")
    .innerJoin("relationships", "users.id", "relationships.following_id")
    .then(function (rows) {
      if (req.session.followed_id !== 0 && req.session.following_id !== 0) {
        for (let i = 0; i < rows.length; i++) {
          if (req.session.location === rows[i].followed_id) {
            req.session.array_user_id[i] = rows[i].following_id;
            req.session.array_user_name[i] = rows[i].user_name;
          }
        }
        let array_user_id_filter = req.session.array_user_id.filter((v) => v);
        let array_user_name_filter = req.session.array_user_name.filter(
          (v) => v
        );
        res.render("follows", {
          title: "follows",
          user_idList: array_user_id_filter,
          user_nameList: array_user_name_filter,
          user_name: req.session.user_name,
          user_id: req.session.user_id,
        });
      } else {
        res.render("follows", {
          title: "follows",
          user_idList: null,
          user_nameList: null,
          user_name: req.session.user_name,
          user_id: req.session.user_id,
        });
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.post("/", function (req, res, next) {
  res.render("follows");
});

module.exports = router;
