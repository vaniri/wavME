const sequelize= require('../config');
const {Datatypes} = require ('sequelize')


const User = sequelize.define('User',{
  email:Datatypes.STRING,
  password: Datatypes.STRING,
  picture:'',
  location:Datatypes.STRING,
  

});

const Artist = sequelize.define('Artist',{
    name:Datatypes.STRING,
});
User.belongsToMany(Artist);
Artist.belongsToMany(User);

User.sync();

module.exports = User;