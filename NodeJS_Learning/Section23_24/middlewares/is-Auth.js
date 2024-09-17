const jwt = require(`jsonwebtoken`);

const createError = require(`../utils/error`).createError;
const throwError = require(`../utils/error`).throwError;

module.exports = (req, res, next) => {
    const authHeader = req.get(`Authorization`);

    if (!authHeader) {
        const error = createError(`Not authenticated`, [], 403);
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, `thIs iS mY seCReT`);
    } catch (err) {
        const error = createError(`Token is not verified correctly`, [], 403);
        throw error;
    }

    if (!decodedToken) {
        const error = createError(`Not authenticated`, [], 403);
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}