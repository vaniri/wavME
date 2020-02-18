const db = require('./db');

async function userswithArtists() {
    let usersWithArtists = await db.User.findAll({ include: [{ model: db.Artist, attributes: ["name"] }] });
    let usersToRender = usersWithArtists.map(userAndArtists => {
      let artists = userAndArtists.Artists.map(artist => ({ name: artist.name }));
      return { ...userAndArtists.dataValues, artists };
    })
    return usersToRender;
  }

  module.exports = { userswithArtists }