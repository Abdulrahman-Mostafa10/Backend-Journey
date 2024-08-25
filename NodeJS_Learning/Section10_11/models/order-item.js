const Sequelize = require(`sequelize`);

const sequelize = require(`../util/database`);

const OrderItem = sequelize.define(`orderItem`, {
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

module.exports = OrderItem;
