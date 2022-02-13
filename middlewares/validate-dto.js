const ApiError = require('../exceptions/api-error');

function validateDto(ajvValidate) {
  return (req, res, next) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      const errors = ajvValidate.errors;
      next(ApiError.BadRequest('invalid input', errors));
    }
    next();
  };
}

module.exports = validateDto;
