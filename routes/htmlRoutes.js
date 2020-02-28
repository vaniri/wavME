const express = require('express');
const router = express.Router();
const userArtist = require("../utils/utils.js")
const path = require("path");

//render main html page
router.get("/", async (req, res) => {
  res.render("index", {});
});

//render allUserspage
router.get("/all", async (req, res) => {
  res.render("allusers", { user: await userArtist.userswithArtists() });
});

//renderchat
router.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

module.exports = router;
