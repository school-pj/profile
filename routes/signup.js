const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get("/", function (req, res, next) {
  res.render("signup", {
    title: "Sign up",
    user_name: null,
    message: null
  });
});

router.post("/", async function (req, res, next) {
  const user_name = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;

  if (password !== confirm) {
    res.render('signup', { title: "Sign up",user_name: null,message: "The user name or password is incorrect." });
  } else {
    await knex('users')
      .where({ user_name: user_name })
      .then(async function (rows) {
            if (rows.length !== 0) {
              res.render('signup', { title: "Sign up",user_name: null,message: "Your username or email address is already registered." });
            } else {
              const hashedPassword = await bcrypt.hash(password, 10);
              knex
                .insert({ user_name: user_name, password: hashedPassword })
                .into('users')
                .then(function (rows) {
                  res.redirect('/');
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
  }
});

module.exports = router;
