const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/:user_id/follows", function (req, res, next) {

  knex
    .from("relationships")
    .join("users", "relationships.following_id", "=","users.id")
    .where({followed_id: req.params.user_id})
    .then(function (rows) {
      res.render("follows", {title: "follows",follows: rows,user_name: req.user.name,user_id: req.user.id,});
    })
    .catch(function (error) {
      console.error(error);
      
    });
});


module.exports = router;
