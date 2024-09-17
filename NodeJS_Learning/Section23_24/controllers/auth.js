const {
  validationResult
} = require(`express-validator`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);

const User = require(`../models/user`);
const router = require("../routes/feed");
const throwError = require(`../utils/error`).throwError;
const createError = require(`../utils/error`).createError;

// ************************* GET Requests ************************* //
exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = createError(`User not found.`, [], 404);
        throw error;
      }
      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      throwError(err, next);
    });
}

// ************************* POST Requests ************************* //

exports.updateStatus = (req, res, next) => {
  const newStatus = req.body.status;

  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = createError(`User not found.`, [], 404);
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: `Status updated successfully!`,
      });
    })
    .catch((err) => {
      throwError(err, next);
    });
}

// ************************* POST Requests ************************* //
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createError(
      `Validation failed, entered data is incorrect.`,
      errors.array(),
      422
    );
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return newUser.save();
    })
    .then((result) => {
      res.status(201).json({
        message: `User created successfully!`,
        userId: result._id,
      });
    })
    .catch((err) => {
      throwError(err, next);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  return User.findOne({
    email: email,
  })
    .then((user) => {
      if (!user) {
        const error = createError(
          `A user with this email could not be found.`,
          [],
          401
        );
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = createError(`Wrong password!`, [], 401);
        throw error;
      }

      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
        `thIs iS mY seCReT`, {
        expiresIn: `1h`,
      }
      );
      console.log(`User logged in successfully!`);
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      throwError(err, next);
    });
};