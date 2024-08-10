const Sequelize = require(`sequelize`);

const sequelize = require(`../util/database`);

const Cart = sequelize.define(`cart`, {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Cart;
