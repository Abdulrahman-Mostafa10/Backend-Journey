const User = require("../models/user");

exports.getLogin = (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById(`66c9830bf1a4067c04831472`)
    .then((user) => {
      if (!user) {
        User.create({
          name: `Abd El-Rahman`,
          email: `bedo@gmail.com`,
          cart: { items: [] },
        });
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err);
        res.redirect(`/`);
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log("Session is destroyed");
    res.redirect(`/`);
  });
};
