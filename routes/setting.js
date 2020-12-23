const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knexfile = require("../knexfile.js");
const knex = require("knex")(knexfile.development);

router.get("/", function (req, res, next) {
  res.render("setting", {
    title: "Setting",
<<<<<<< HEAD
    user_name: req.user.user_name,
    user_id: req.user.id,
=======
    message: req.flash("message"),
    user_name: req.session.user_name,
    user_id: req.session.user_id,
>>>>>>> 37f9747dfd2e8ab7f8c1ee51f9a94a28971e9cc4
  });
});

router.post("/", async function (req, res, next) {
  const user_name = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;
  const user_id = req.session.user_id;

  //バリデート処理
  if (password !== confirm) {
    req.flash("message", "Password(retype) is incorrect");
    res.redirect("/setting");
  }

  //passwordをハッシュ化してupdate
  const hashedPassword = await bcrypt.hash(password, 10);
  knex("users")
    .where({ id: user_id })
    .update({ user_name: user_name, password: hashedPassword })
    .then(function (rows) {
      //変更後のユーザー情報を再取得するためログアウトにリダイレクト
      res.redirect("/logout");
      console.log(rows[0]);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
