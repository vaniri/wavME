const express = require('express');
const router = express.Router();
const db = require("../models/db.js");
const userArtist = require("../utils/utils.js")


//render main html page
router.get("/", async (req, res) => {
  res.render("index", {});
});

//render allUserspage
router.get("/all", async (req, res) => {
  res.render("allusers", { user: await userArtist.userswithArtists() });
});

module.exports = router;
