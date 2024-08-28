const MONGODB_URI = `mongodb+srv://abdelrahman:bedo@cluster0.fccjy.mongodb.net/shop`;

const path = require(`path`);

const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const csrf = require(`csurf`);
const flash = require(`connect-flash`);

const MongoDBStore = require(`connect-mongodb-session`)(session);
const store = new MongoDBStore({ uri: MONGODB_URI, collection: `sessions` });
const csrfProtection = csrf();

const errorController = require(`./controllers/error`);
const User = require(`./models/user`);

const app = express();

app.set(`view engine`, `ejs`);
app.set(`views`, `views`);

const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);
const authRoutes = require(`./routes/auth`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, `public`)));
app.use(
  session({
    secret: `THis is abdELrAhmaN sEcreT reCipe`,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, _, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(`/admin`, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
