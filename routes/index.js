const express = require('express');
const router = express.Router();
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);
const relationships = require('../models/relationships');

router.use('/signup', require('./signup'));
router.use('/setting', require('./setting'));
router.use('/logout', require('./logout'));
router.use('/users', require('./users'));
router.use('/login', require('./login'));
router.use('/users', require('./profile'));
router.use('/users', require('./follows'));
router.use('/users', require('./followers'));


/* GET home page. */
router.get("/", async function (req, res, next) {
  if (req.isAuthenticated()) {
    const user_id = req.user.id;
    const user_name = req.user.user_name;

    following_id = await relationships.followers_count(user_id);

    followed_id = await relationships.following_count(user_id);

    knex('users')
      .where('id', req.user.id)
      .then(function (rows) {
        res.render('index', { title: "Profile App", isLoggedIn: req.isAuthenticated(), user_id: user_id, user_name: user_name, contentList: rows, followed_id: followed_id, follower_id: following_id });
      });
  } else {
    res.render('index', { title: "Welcome to the MicroPost App", isLoggedIn: req.isAuthenticated(), user_name: req.session.user_name, user_id: req.session.user_id });
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

module.exports = router;
