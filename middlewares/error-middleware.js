const ApiError = require('../exceptions/api-error');
const mongoose = require('mongoose');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    if (err.message.match(/unique/)) {
      return res.status(409).json({ message: err.message, errors: err.errors });
    }
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'internal server error' });
};
