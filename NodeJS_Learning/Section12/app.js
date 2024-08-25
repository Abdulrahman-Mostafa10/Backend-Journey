const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);
const mongoConnect = require(`./util/database`).mongoConnect;
const User = require(`./models/user`);

const express = require(`express`);

const app = express();

const errorController = require(`./controllers/error`);
const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);

app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use((req, _, next) => {
  User.findById(`66bb253a1f270b7f8b85e030`)
    .then((user) => {
      req.user = new User(
        user.name,
        user.email,
        user._id,
        user.cart,
        user.orders
      );
      next();
    })
    .catch((err) => console.log(err));
});
app.use(`/admin`, adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

mongoConnect(() => {
  app.listen(3000);
});
