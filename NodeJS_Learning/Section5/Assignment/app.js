const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);

const express = require(`express`);

const app = express();

const usersRoutes = require(`./routes/users`);
const homeRoutes = require(`./routes/home`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, `public`)));

app.use(`/users`, usersRoutes);
app.use(homeRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, `views`, `404.html`));
});

app.listen(3000);
