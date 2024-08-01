const path = require(`path`);

const express = require(`express`);

const usersData = require(`./home`);

const router = express.Router();

router.get(`/user`, (req, res) => {
  res.render(`user`, {
    docTitle: `User Page`,
    users: usersData.users,
    path: `/user`,
  });
});

module.exports = router;
