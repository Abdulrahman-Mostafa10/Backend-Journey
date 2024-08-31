const crypto = require(`crypto`);

const bcrypt = require(`bcryptjs`);
const nodeMailer = require(`nodemailer`);
const sg = require(`nodemailer-sendgrid-transport`);
const { validationResult } = require(`express-validator`);

const errorInvoker = require(`../util/errorInvoker`);

const transporter = nodeMailer.createTransport(
  sg({
    auth: {
      api_key: ``,
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
    oldInput: { email: ``, password: `` },
    validationErrors: [],
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
    oldInput: { email: ``, password: ``, confirmPassword: `` },
    validationErrors: [],
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render(`auth/login`, {
      path: `/login`,
      pageTitle: `Login`,
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render(`auth/login`, {
          path: `/login`,
          pageTitle: `Login`,
          errorMessage: `Email not found.`,
          oldInput: { email: email, password: password },
        });
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
          return res.status(422).render(`auth/login`, {
            path: `/login`,
            pageTitle: `Login`,
            errorMessage: `Password is incorrect.`,
            oldInput: { email: email, password: password },
          });
        })
        .catch(() => {
          return next(
            errorInvoker(`Internal server error while encrypting.`, 500)
          );
        });
    })
    .catch((err) => {
      return next(errorInvoker(`Internal server error while logging in.`, 500));
    });
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render(`auth/signup`, {
      path: `/signup`,
      pageTitle: `Signup`,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect(`/login`);
      // return transporter.sendMail({
      //   from: `abdelrahman.abdeltawab03@eng-st.cu.edu.eg`,
      //   to: email,
      //   subject: `Signup succeeded!`,
      //   html: `<h1>You successfully signed up!</h1>`,
      //   text: `You successfully signed up!`,
      // });
    })
    .catch((err) => {
      return next(errorInvoker(`Internal server error while signing up.`, 500));
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
      .catch((err) => {
        return next(
          errorInvoker(`Internal server error while resetting.`, 500)
        );
      });
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
        return next(errorInvoker(`Invalid token.`, 500));
      }
      res.render(`auth/new-password`, {
        path: `/new-password`,
        pageTitle: `New Password`,
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      return next(
        errorInvoker(`Internal server error while user is resetting.`, 500)
      );
    });
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
      if (!user) {
        return next(errorInvoker(`Invalid token`, 500));
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      if (!hashedPassword) {
        return next(
          errorInvoker(`Internal server error while hashing password.`, 500)
        );
      }
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      res.redirect(`/login`);
    })
    .catch((err) => {
      return next(
        errorInvoker(`Internal server error while resetting password.`, 500)
      );
    });
};
