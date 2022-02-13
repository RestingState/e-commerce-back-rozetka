const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/customer-model');
const CustomerDto = require('../dtos/customer-dto');

const getValidCustomerAccessToken = async (payload, expiration) => {
  const customer = await CustomerModel.findOne({ login: payload.login });
  const customerDto = new CustomerDto(customer);
  const accessToken = jwt.sign(
    { ...customerDto },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: expiration
    }
  );
  return accessToken;
};

module.exports = {
  getValidCustomerAccessToken
};
