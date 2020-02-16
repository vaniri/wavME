const express = require('express');
const router = express.Router();
const db = require("../models/db.js");

router.get("/", async (req, res) => {
  let username = await db.User.findAll();
  console.log(username);
  res.render("index", { User: username});
  });

  // router.get("/", async (req, res) => {
  //   let allArtists = await artist.all();
  //   res.render("index", { artists: allArtists});
  //   });

  module.exports = router;