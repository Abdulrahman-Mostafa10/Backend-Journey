module.exports = (errorMessage, status) => {
  const error = new Error(errorMessage);
  error.httpStatusCode = status;
  return error;
};
