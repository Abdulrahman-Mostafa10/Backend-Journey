const crypto = require(`crypto`);

const bcrypt = require(`bcryptjs`);
const nodeMailer = require(`nodemailer`);
const mg = require(`nodemailer-mailgun-transport`);

const transporter = nodeMailer.createTransport(
  mg({
    auth: {
      api_key: `3819a3d9dfaf680b11699690da9eb7b2-2b91eb47-fc875a9d`,
      domain: `sandboxbc84a7529b14412e931964da14977cf3.mailgun.org`,
    },
  })
);

const User = require(`../models/user`);
const path = require("path");

exports.getLogin = (req, res) => {
  let message = req.flash(`error`);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render(`auth/login`, {
    path: `/login`,
    pageTitle: `Login`,
    errorMessage: message,
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash(`error`);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render(`auth/signup`, {
    path: `/signup`,
    pageTitle: `Signup`,
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash(`error`, `Invalid email or password.`);
        return res.redirect(`/login`);
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect(`/`);
            });
          }
          req.flash(`error`, `Invalid email or password.`);
          res.redirect(`/login`);
        })
        .catch((err) => {
          console.log(err);
          res.redirect(`/login`);
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          `error`,
          `E-Mail exists already, please pick a different one.`
        );
        return res.redirect(`/signup`);
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect(`/login`);
          return transporter.sendMail({
            from: `abdelrahman.abdeltawab03@eng-st.cu.edu.eg`,
            to: email,
            subject: `Signup succeeded!`,
            html: `<h1>You successfully signed up!</h1>`,
            text: `You successfully signed up!`,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect(`/`);
  });
};

exports.getReset = (req, res) => {
  let message = req.flash(`error`);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render(`auth/reset`, {
    path: `/reset`,
    pageTitle: `Reset Password`,
    errorMessage: message,
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, bytes) => {
    if (err) {
      console.log(err);
      return res.redirect(`/reset`);
    }
    const token = bytes.toString(`hex`);
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash(`error`, `No account with that email is found.`);
          return res.redirect(`/reset`);
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then(() => {
          res.redirect(`/`);
          transporter.sendMail({
            to: req.body.email,
            from: `abdelrahman.abdeltawab03@eng-st.cu.edu.eg`,
            subject: `Password reset`,
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
              `,
          });
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash(`error`);
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      if (!user) {
        req.flash(`error`, `Invalid token.`);
        return res.redirect(`/login`);
      }
      res.render(`auth/new-password`, {
        path: `/new-password`,
        pageTitle: `New Password`,
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res) => {
  const userId = req.body.userId;
  const token = req.body.token;
  const newPassword = req.body.password;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect(`/login`);
    })
    .catch((err) => console.log(err));
};
