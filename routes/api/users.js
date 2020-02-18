const express = require('express');
const router = require('express').Router();
const db = require('../../models/db');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//insert user to the db and associate with the artists
router.post('/users', async (req, res) => {
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
  res.json({});
});

router.get('/users', async (req, res) => {
  let users = await db.User.findAll();
  res.json({ users: users });
});

router.get('/users/match/:id', async (req, res) => { 
  const user = await db.User.findOne({ where: { id: req.params.id } });
  res.json(user);
});




module.exports = router;
