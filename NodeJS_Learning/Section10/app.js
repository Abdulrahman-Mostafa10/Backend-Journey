const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);
const sequelize = require(`./util/database`);

const express = require(`express`);

const app = express();

const Product = require(`./models/product`);
const User = require(`./models/user`);
const Cart = require(`./models/cart`);
const Order = require(`./models/order`);
const OrderItem = require(`./models/order-item`);
const CartItem = require(`./models/cart-item`);

const errorController = require(`./controllers/error`);
const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);

app.set(`view engine`, `ejs`);

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use(`/admin`, adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

Product.belongsTo(User, { constraints: true, onDelete: `CASCADE` });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: `CASCADE` });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: `Abd El-Rahman`, email: `bedo@gmail.com` });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
