const path = require(`path`);

const express = require(`express`);

const router = express.Router();

const users = [];

router.get(`/`, (req, res) => {
  res.render(`home`, {
    docTitle: `Home Page`,
    path: `/`,
  });
});

router.post(`/`, (req, res) => {
  users.push({ name: req.body.name });
  res.redirect(`/`);
});

exports.routes = router;
exports.users = users;
