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
exports.getStatus = async (req, res, next) => {

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = createError(`User not found.`, [], 404);
      throw error;
    }
    res.status(200).json({
      status: user.status,
    });
  }
  catch (err) {
    throwError(err, next);
  };
};

// ************************* POST Requests ************************* //

exports.updateStatus = async (req, res, next) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = createError(`User not found.`, [], 404);
      throw error;
    }
    user.status = newStatus;
    const result = await user.save();

    if (!result) {
      const error = createError(`Could not update status.`, [], 500);
      throw error;
    }

    res.status(200).json({
      message: `Status updated successfully!`,
    });
  }
  catch (err) {
    throwError(err, next);
  };
}

// ************************* POST Requests ************************* //
exports.signup = async (req, res, next) => {
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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });

    const result = await newUser.save();

    if (!result) {
      const error = createError(`Could not save the user.`, [], 500);
      throw error;
    }

    res.status(201).json({
      message: `User created successfully!`,
      userId: result._id,
    });
  }
  catch (err) {
    throwError(err, next);
  };
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = createError(`A user with this email could not be found.`, [], 401);
      throw error;
    }

    const areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) {
      const error = createError(`Wrong password!`, [], 401);
      throw error;
    }

    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString(),
    },
      `thIs iS mY seCReT`, {
      expiresIn: `1h`,
    }
    );

    console.log(`User logged in successfully!`);

    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  }
  catch (err) {
    throwError(err, next);
  };
};