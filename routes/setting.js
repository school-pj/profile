const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);


router.get("/", function (req, res, next) {
  res.render("setting", {
    title: "Setting",
    user_name: req.user.user_name,
    user_id: req.user.id,
  });
});


router.post('/', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;

  if (password !== confirm) {
    res.render("setting", {
      title: "Setting",
      pass: "Password(retype) is incorrect",
    });
    return;
  }

  knex
    .insert({ username, password: username, password })
    .into("users")
    .then(function (rows) {
      res.redirect("/setting");
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
