const express = require(`express`);

const { body } = require(`express-validator`);

const User = require(`../models/user`);

const authController = require(`../controllers/auth`);

const router = express.Router();

router.get(`/login`, authController.getLogin);
router.get(`/signup`, authController.getSignup);
router.get(`/reset`, authController.getReset);
router.get(`/reset/:token`, authController.getNewPassword);

router.post(
  `/login`,
  [
    body(`email`, `Invalid email, Please try again!`)
      .isEmail()
      .normalizeEmail(),
    body(`password`, `Invalid password, Please try again!`)
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post(`/logout`, authController.postLogout);
router.post(
  `/signup`,
  [
    body(`email`, `Please enter a valid email address.`)
      .isEmail()
      .normalizeEmail()
      .custom((value, {}) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              `E-Mail exists already, please pick a different one.`
            );
          }
        });
      }),
    body(
      `password`,
      `Please enter a password with only numbers and text and at least 4 characters.`
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
    body(`confirmPassword`).custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(`Passwords have to match!`);
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post(`/reset`, authController.postReset);
router.post(`/new-password`, authController.postNewPassword);

module.exports = router;
