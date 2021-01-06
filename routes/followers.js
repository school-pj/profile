const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/:user_id/followers", function (req, res, next) {
  req.session.array_user_id = [];
  req.session.array_user_name = [];

  knex
    .from("users")
    .innerJoin("relationships", "users.id", "relationships.followed_id")
    .then(function (rows) {
      if (rows[0].followed_id !== undefined && rows[0].following_id !== undefined) {
        for (let i = 0; i < rows.length; i++) {
          if (req.params.user_id == rows[i].following_id) {
            req.session.array_user_id[i] = rows[i].followed_id;
            req.session.array_user_name[i] = rows[i].user_name;
          }
        }
        let array_user_id_filter = req.session.array_user_id.filter((v) => v);
        let array_user_name_filter = req.session.array_user_name.filter((v) => v);
        res.render("followers", {title: "followers",user_idList: array_user_id_filter,user_nameList: array_user_name_filter,user_name: req.session.user_name,user_id: req.session.user_id,});
      } else {
        res.render("followers", {title: "followers",user_idList: "",user_nameList: "",user_name: req.session.user_name,user_id: req.session.user_id,});
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.post("/:user_id/followers", function (req, res, next) {
  res.render("followers");
});

module.exports = router;
