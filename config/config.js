const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.JAWSDB_URL || 'mysql://root:qwerty212342467@localhost:3306/users_db'
);

module.exports = sequelize;