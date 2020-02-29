const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.JAWSDB_URL || 'mysql://root@localhost:3306/users_db'
);

module.exports = sequelize;