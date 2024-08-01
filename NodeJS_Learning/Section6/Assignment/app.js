const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);

const express = require(`express`);

const app = express();

const homeRoutes = require(`./routes/home`);
const userRoutes = require(`./routes/user`);

app.set(`view engine`, `pug`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use(homeRoutes.routes);
app.use(userRoutes);

app.use((req, res) => {
  res.status(404).render(`error`, {
    docTitle: `Error Page`,
    errorMessage: `Page not found`,
  });
});

app.listen(3000);
