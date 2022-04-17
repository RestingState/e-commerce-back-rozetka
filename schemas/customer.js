const ajvInstance = require('./ajv-instance');

const registerSchema = {
  type: 'object',
  properties: {
    login: { type: 'string', minLength: 5, maxLength: 30 },
    password: {
      type: 'string',
      minLength: 5,
      maxLength: 30,
      format: 'password'
    },
    firstName: { type: 'string', maxLength: 50 },
    lastName: { type: 'string', maxLength: 50 },
    middleName: { type: 'string', maxLength: 50 },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    birthday: { type: 'string' },
    sex: { type: 'string' },
    interfaceLanguage: { type: 'string' },
    additionalInfo: { type: 'array' }
  },
  required: ['login', 'password', 'firstName', 'lastName', 'phone', 'email']
};

const loginSchema = {
  type: 'object',
  properties: {
    login: { type: 'string', minLength: 5, maxLength: 30 },
    password: {
      type: 'string',
      minLength: 5,
      maxLength: 30,
      format: 'password'
    }
  },
  required: ['login', 'password']
};

const registerValidation = ajvInstance.compile(registerSchema);
const loginValidation = ajvInstance.compile(loginSchema);

module.exports = {
  registerValidation,
  loginValidation
};
