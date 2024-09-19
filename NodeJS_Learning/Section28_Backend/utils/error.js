exports.createError = (message, data, statusCode) => {
    const error = new Error(message);
    if (!data) {
        data = [];
    }
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
    if (!error.data) {
        error.data = [];
    }

    next(error);
};