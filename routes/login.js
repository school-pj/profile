const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/", (req, res, next) => {
  res.render("login", {
    message: req.flash("message"),
    user_name: req.session.user_name,
    user_id: req.session.user_id,
  });
});
router.post('/',
  passport.authenticate('local-strategy', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

module.exports = router;