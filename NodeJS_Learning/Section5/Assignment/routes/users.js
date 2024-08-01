const path = require(`path`);

const express = require(`express`);

const rootDir = require(`../util/root`);

const router = express.Router();

router.get(`/add-user`, (req, res) => {
  res.sendFile(path.join(rootDir, `views`, `usersPage.html`));
});

router.post(`/add-user`, (req, res) => {
  console.log(req.body);
  res.redirect(`/`);
});

module.exports = router;
