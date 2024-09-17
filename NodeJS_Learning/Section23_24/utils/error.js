exports.createError = (message, data, statusCode) => {
    const error = new Error(message);
    error.data = data;
    error.statusCode = statusCode;
    return error;
};

exports.throwError = (error, next) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    if (!error.message) {
        error.message = 'An unknown error occurred!';
    }
    next(error);
};