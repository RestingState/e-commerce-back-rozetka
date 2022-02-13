const CustomerModel = require('../models/customer-model');
const CustomerData = require('../testsData/customer');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const createCustomer = async (data) => {
  const customer = Object.assign({}, data);
  const hashPassword = await bcrypt.hash(customer.password, 3);
  customer.password = hashPassword;
  await CustomerModel.create(customer);
};

const createCustomers = async (arrOfCustomersData) => {
  for (let i = 0; i < arrOfCustomersData.length; ++i) {
    await createCustomer(arrOfCustomersData[i]);
  }
};

const clearCustomerCollection = async () => {
  await CustomerModel.deleteMany();
};

const initializeCustomerCollectionWithOneCustomer = async () => {
  await createCustomer(CustomerData.registrationCorrect1);
};

const initializeCustomerCollectionWithManyCustomers = async () => {
  await createCustomers([
    CustomerData.registrationCorrect1,
    CustomerData.registrationCorrect2,
    CustomerData.registrationCorrect3
  ]);
};

const getActivationLink = () => {
  const activationLink = uuid.v4();
  return activationLink;
};

const createCustomerWithActivationLink = async (payload, activationLink) => {
  payload.activationLink = activationLink;
  await createCustomer(payload);
};

module.exports = {
  clearCustomerCollection,
  initializeCustomerCollectionWithOneCustomer,
  initializeCustomerCollectionWithManyCustomers,
  getActivationLink,
  createCustomerWithActivationLink
};
