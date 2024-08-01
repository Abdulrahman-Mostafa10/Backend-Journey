const path = require(`path`);
const bodyParser = require(`body-parser`);

const rootDir = require(`./util/root`);

const express = require(`express`);

const app = express();

const adminRoutes = require(`./routes/admin`);
const shopRoutes = require(`./routes/shop`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, `public`)));

app.use(`/admin`, adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, `views`, `error.html`));
});

app.listen(3000);
