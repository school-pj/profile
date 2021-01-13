const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/:user_id/followers", function (req, res, next) {

  knex
    .from("relationships")
    .join("users", "users.id", "relationships.followed_id")
    .where({following_id: req.params.user_id})
    .then(function (rows) {
      res.render("followers", {title: "follows",followers: rows,user_name: req.user.name,user_id: req.user.id});
    })
    .catch(function (error) {
      console.error(error);
    });
});


module.exports = router;
