const express = require("express");
const router = express.Router();
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "profileapp",
  },
  useNullAsDefault: true,
});

router.get("/", function (req, res, next) {
  knex
    .select()
    .from("users")
    .then(function (rows) {
      res.render("users", {
        title: "All Users",
        user_name: req.session.user_name,
        user_id: req.session.user_id,
        userlist: rows 
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});
module.exports = router;
