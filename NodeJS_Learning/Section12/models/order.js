const Sequelize = require(`sequelize`);

const sequelize = require(`../util/database`);

const Order = sequelize.define(`order`, {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Order;
