const Sequelize = require(`sequelize`);

const sequelize = require(`../util/database`);

const CartItem = sequelize.define(`cartItem`, {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

module.exports = CartItem;
