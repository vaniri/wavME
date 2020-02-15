const express = require('express');
const router = express.Router();
const db = require("../models/db.js");

router.get("/", async (req, res) => {
  let findUser = await db.User.findAll();
  res.render("index", { user: findUser});
  });

  router.get("/", async (req, res) => {
    let allArtists = await artist.all();
    res.render("index", { artists: allArtists});
    });

  module.exports = router;