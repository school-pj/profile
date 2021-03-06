const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get("/", function (req, res, next) {
  knex
    .select()
    .from("users")
    .then(function (rows) {
      res.render("users", {
        title: "All Users",
        user_name: req.user.user_name,
        user_id: req.user.id,
        userlist: rows,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});
module.exports = router;
