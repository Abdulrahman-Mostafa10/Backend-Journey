const express = require(`express`);
const {
    body
} = require(`express-validator`);

const User = require(`../models/user`);

const throwError = require(`../utils/error`).throwError;

const isAuth = require(`../middlewares/is-Auth`);

const authController = require(`../controllers/auth`);

const router = express.Router();

// ************************* GET Requests ************************* //

router.get(`/status`, isAuth, authController.getStatus);

// ************************* POST Requests ************************* //

router.post(`/signup`, [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email.')
        .custom(async (value, { req }) => {
            try {
                const result = await User.findOne({ email: value });
                if (result) {
                    return Promise.reject('E-mail already exists!');
                }
            }
            catch (err) {
                throwError(err, next);
            }
        }),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.').isAlphanumeric().withMessage('Password must contain only numbers and letters.'),
    body('name').trim().not().isEmpty().withMessage('Name cannot be empty.'),
], authController.signup);

router.post(`/login`, authController.login);

// ************************* PUT Requests ************************* //

router.put(`/status`, isAuth, authController.updateStatus);

module.exports = router;