const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajvInstance = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajvInstance);

module.exports = ajvInstance;
