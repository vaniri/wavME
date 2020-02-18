const express = require('express');
const router = require('express').Router();
const db = require('../../models/db');
const usersArtists = require('../../models/utils.js');
const matching = require("../../models/matching.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//insert user to the db and associate with the artists
router.post('/', async (req, res) => {
  try {
    let userRecord = await db.User.create(req.body);
    let UserId = userRecord.id;
    for (let artist of req.body.artists) {
      let artistRecord = await db.Artist.findOne({ where: { name: artist } });
      if (!artistRecord) {
        artistRecord = await db.Artist.create({ name: artist });
      }
      let ArtistId = artistRecord.id;
      await db.UserArtist.create({ UserId, ArtistId });
    }
    res.json({ message: "OK", userId: UserId });
  } catch (err) {
    console.log("Error creating new user", err);
    res.json({ message: "FAIL", reason: err });
  }
});

//get users who match with current user
router.get('/match/:id', async (req, res) => { 
  let allUsers = await usersArtists.userswithArtists();
  let otherUsers = allUsers.filter(user => user.id !== +req.params.id);
  let curUser = allUsers.find(user => user.id === +req.params.id);
  let result = matching.findMatch(curUser, otherUsers);
  res.json(result);
});


module.exports = router;
