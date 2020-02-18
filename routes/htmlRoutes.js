const express = require('express');
const router = express.Router();
const db = require("../models/db.js");


//render main html page
router.get("/", async (req, res) => {
  res.render("index", { user: await userswithArtists() });
});

async function userswithArtists() {
  let usersWithArtists = await db.User.findAll({ include: [{ model: db.Artist, attributes: ["name"] }] });
  let usersToRender = usersWithArtists.map(userAndArtists => {
    let artists = userAndArtists.Artists.map(artist => ({ name: artist.name }));
    return { ...userAndArtists.dataValues, artists };
  })
  return usersToRender;
}

module.exports = router;
