const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);

const express = require(`express`);

const app = express();

const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);

app.set(`view engine`, `ejs`);
app.set(`views`, `views/ejsFiles`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use(`/admin`, adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render(`error`, {
    path: `/error`,
    docTitle: `Error Page`,
    errorMessage: `Page is not found`,
  });
});

app.listen(3000);
