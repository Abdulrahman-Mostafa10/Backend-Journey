const Sequelize = require("sequelize");

const sequelize = new Sequelize(`node-complete`, `root`, `bedo`, {
  dialect: `mysql`,
  host: `localhost`,
});

module.exports = sequelize;
