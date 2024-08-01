const path = require(`path`);

const rootDir = require(`../util/root`);

const express = require(`express`);

const router = express.Router();

router.get(`/add-product`, (req, res) => {
  res.sendFile(path.join(rootDir, `views`, `add-product.html`));
});

router.post(`/add-product`, (req, res) => {
  console.log(req.body);
  res.redirect(`/`);
});

module.exports = router;
