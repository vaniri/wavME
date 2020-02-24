const db = require('../models/db');

async function userswithArtists() {
    let usersWithArtists = await db.User.findAll({ include: [{ model: db.Artist, attributes: ["name"] }] });
    let usersToRender = usersWithArtists.map(userAndArtists => {
      let artists = userAndArtists.Artists.map(artist => ({ name: artist.name }));
      return { ...userAndArtists.dataValues, artists };
    })
    return usersToRender;
  }

  async function userwithArtists (email) {
    let userWithArtists = await db.User.findOne({ include: [{ model: db.Artist, attributes: ["name"] }], where: { email: email }  });
    let artists = userWithArtists.Artists.map(artist => artist.name);
    return { ...userWithArtists.dataValues, artists };
  }

  module.exports = { userswithArtists, userwithArtists }