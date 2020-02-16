const express = require('express');
const router = express.Router();
const db = require("../models/db.js");

//render main html page
router.get("/", async (req, res) => {
  let username = await db.User.findAll();
  console.log(username.map(user => user.dataValues));
  res.render("index", { user: username.map(user => user.dataValues) });
});

// router.get("/", async (req, res) => {
//   let allArtists = await artist.all();
//   res.render("index", { artist: allArtists });
// });

module.exports = router;