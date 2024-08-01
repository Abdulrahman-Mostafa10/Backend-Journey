const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);

const express = require(`express`);

const app = express();

const errorController = require(`./controllers/error`);
const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);

app.set(`view engine`, `ejs`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use(`/admin`, adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

app.listen(3000);
