const path = require(`path`);

const express = require(`express`);
const mongoose = require(`mongoose`);
const session = require(`express-session`);
const bodyParser = require(`body-parser`);
const csrf = require(`csurf`);
const flash = require(`connect-flash`);
const multer = require(`multer`);

const MONGODB_URI = ``;
const MongoDBStore = require(`connect-mongodb-session`)(session);
const store = new MongoDBStore({ uri: MONGODB_URI, collection: `sessions` });
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, `images`);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = new Date().toISOString().replace(/:/g, '-') + ' - ' + file.originalname;
    cb(null, sanitizedFilename);
  },
});
const fileFilter = (_, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const errorController = require(`./controllers/error`);
const User = require(`./models/user`);

const app = express();

app.set(`view engine`, `ejs`);
app.set(`views`, `views`);

const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);
const authRoutes = require(`./routes/auth`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single(`image`)
);
app.use(express.static(path.join(__dirname, `public`)));
app.use(`/images`, express.static(path.join(__dirname, `images`)));
app.use(
  session({
    secret: `THis is abdELrAhmaN sEcreT reCipe`,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, _, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(flash());

app.use(`/admin`, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get(`/errors`, errorController.getErrors);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  const status = error.httpStatusCode || 500;
  const csrfToken = req.csrfToken ? req.csrfToken() : ''; // Safely access csrfToken
  const isAuthenticated = req.session ? req.session.isLoggedIn : false; // Safely access isLoggedIn

  res.status(status).render('errors', {
    pageTitle: 'Error!',
    path: '/errors',
    message: error.message,
    csrfToken: csrfToken,
    isAuthenticated: isAuthenticated,
  });
});



mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
