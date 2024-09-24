const isAuth = require("../middleware/is-Auth");

exports.get404 = (req, res, _) => {
  res.status(404).render(`404`, {
    pageTitle: `Page Not Found`,
    path: `/404`,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getErrors = (req, res, _) => {
  res.status(500).render(`errors`, {
    pageTitle: `Error!`,
    path: `/errors`,
    isAuthenticated: req.session.isLoggedIn,
  });
};