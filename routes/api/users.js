const express = require('express');
const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const db = require('../../models/db');
const usersArtists = require('../../utils/utils.js');
const matching = require('../../utils/matching.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//insert user to the db and associate with the artists
router.post('/', async (req, res) => {
  try {
    //hash and store password
    req.body.password = await argon2.hash(req.body.password);
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
    res.json({ message: "OK", userId: UserId, token: makeToken(UserId) });
  } catch (err) {
    console.log("Error creating new user", err);
    res.json({ message: "FAIL", reason: err });
  }
});

const jwtSecret = "yo dawg i herd you like authorization";

//get users who match with current user
router.get('/match/:id',
  expressJwt({ secret: jwtSecret }),
  async (req, res) => {
    console.log("user token", req.user);

    if (+req.user.userId !== +req.params.id) { 
      res.json({ message: "FAIL", reason: "You can't ask for matches of other users" });
      return;
    }

    try {
      let allUsers = await usersArtists.userswithArtists();
      let otherUsers = allUsers.filter(user => user.id !== +req.params.id);
      let curUser = allUsers.find(user => user.id === +req.params.id);
      if (!curUser) {
        console.warn("No user found!");
        res.json({ message: "FAIL", reason: "no user found" });
        return;
      }
      let result = matching.findMatch(curUser, otherUsers);
      res.json({ result, message: "OK" });
    } catch (err) {
      res.json({ message: "FAIL", reason: err });
    }
  });

//create jwt token:
//create a json object with the field "userId" and sign it using "jwtSecret"
function makeToken(userId) {
  return jwt.sign({ userId }, jwtSecret);
}

router.post('/login', async (req, res) => {
  try {
    let user = await usersArtists.userwithArtists(req.body.email);
    console.log(user);
    if (!user) {
      console.log("No user found!");
      res.json({ message: "FAIL", reason: "No user found!" });
      return;
    }
    //unhash and verify password
    let passwordMatches = await argon2.verify(user.password, req.body.password);
    if (!passwordMatches) {
      console.log("Wrong password");
      res.json({ message: "FAIL", reason: "Wrong password!" });
      return;
    }

    console.log("Login Successful!");
    res.json({ message: "OK", userId: user.id, token: makeToken(user.id), profile: user });
  } catch (err) {
    console.log("Error logging in:", err);
    res.json({ message: "FAIL", reason: err });
  }
})


//spotify
/*

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: '973c7a45dcef46e299c4aad1b3bb7587',
  clientSecret: 'd689a6efdce44903bf6f106d648df32e',

});

spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    spotifyApi.getUserPlaylists('petteralexis')
      .then(function (data) {
        let newdata = data.body.items.map(item => item);
        console.log("new data", newdata);
        console.log('Some information about this user', data.body.items[0].tracks);
      }, function (err) {
        console.log('Something went wrong!', err);
      });
  },
  function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);
*/

module.exports = router;
