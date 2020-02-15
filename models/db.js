const sequelize = require('../config/config');
const { DataTypes } = require('sequelize')

//defining user table
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    notEmpty: true,
    len: [2, 20],
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    isEmail: true,
    notEmpty: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    notEmpty: true,
    len: [2, 20]
  },
  photo: {
    type: DataTypes.STRING,
    isUrl: true
  },
  location: {
    type: DataTypes.STRING,
    notEmpty: true
  }
});

//defining artists table
const Artist = sequelize.define('Artist', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    notEmpty: true
  },
});

//defining the connection table
const UserArtist = sequelize.define('UserArtist', {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  ArtistId: {
    type: DataTypes.INTEGER,
    references: {
      model: Artist, 
      key: 'id'
    }
  }
});

//conecting users table with authors table
User.belongsToMany(Artist, { through: "UserArtist" });
Artist.belongsToMany(User, { through: "UserArtist" });

User.sync();
Artist.sync();
UserArtist.sync();

module.exports = { User, Artist };