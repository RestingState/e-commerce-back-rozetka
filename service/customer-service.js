const CustomerModel = require('../models/customer-model');
const OrderReceiverModel = require('../models/orderReceiver-model');
const DeliveryAddressModel = require('../models/deliveryAddress-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const CustomerDto = require('../dtos/customer-dto');
const OrderReceiverDto = require('../dtos/orderReceiver-dto');
const DeliveryAddressDto = require('../dtos/deliveryAddress-dto');
const ApiError = require('../exceptions/api-error');
const mongoose = require('mongoose');

class CustomerService {
  async registration(data) {
    // Check if all required data for creating model was provided
    const potentialCustomer = new CustomerModel(data);
    const err = potentialCustomer.validateSync();
    if (err) {
      throw ApiError.BadRequest(err.message, err.errors);
    }

    const hashPassword = await bcrypt.hash(data.password, 3);
    const activationLink = uuid.v4();
    data.password = hashPassword;
    data.activationLink = activationLink;
    const customer = await CustomerModel.create(data);
    await mailService.sendActivationMail(
      data.email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const customerDto = new CustomerDto(customer);
    const tokens = tokenService.generateTokens({ ...customerDto });
    await tokenService.saveToken(customerDto.id, tokens.refreshToken);

    return { ...tokens, customer: customerDto };
  }

  async activate(activationLink) {
    const customer = await CustomerModel.findOne({ activationLink });
    if (!customer) {
      throw ApiError.BadRequest('Неккоректная ссылка активации');
    }
    customer.isActivated = true;
    console.log(customer);
    await customer.save();
  }

  async login(data) {
    const customer = await CustomerModel.findOne({ login: data.login });
    if (!customer) {
      throw ApiError.BadRequest('incorrect login');
    }
    const isPassEquals = await bcrypt.compare(data.password, customer.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('incorrect password');
    }
    const customerDto = new CustomerDto(customer);
    const tokens = tokenService.generateTokens({ ...customerDto });
    await tokenService.saveToken(customerDto.id, tokens.refreshToken);

    return { ...tokens, customer: customerDto };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const customerData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!customerData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const customer = await CustomerModel.findById(customerData.id);
    const customerDto = new CustomerDto(customer);
    const tokens = tokenService.generateTokens({ ...customerDto });
    await tokenService.saveToken(customerDto.id, tokens.refreshToken);

    return { ...tokens, customer: customerDto };
  }

  async deleteCustomer(id, refreshToken) {
    const responseFromDeleteCustomer = await CustomerModel.deleteOne({
      _id: id
    });
    if (responseFromDeleteCustomer.deletedCount == 0) {
      return null;
    }
    await tokenService.removeToken(refreshToken);
    return responseFromDeleteCustomer;
  }

  async getCustomerPersonalInfo(id) {
    const returnFields = `-_id name surname middleName 
    birthday sex interfaceLanguage phone 
    email defaultOrderReceiver login interests 
    pets additionalInfo createdAt updatedAt primaryOrderReceiver`;
    const customer = await CustomerModel.findById(id, returnFields);
    return customer;
  }
  async updateCustomer(id, data) {
    const customer = await CustomerModel.findOneAndUpdate(id, data);
    return customer;
  }

  async createOrderReceiver(data) {
    const candidate = await OrderReceiverModel.findOne({ phone: data.phone });
    if (!data.phone || !data.name || !data.surname) {
      throw ApiError.BadRequest('Invalid Input');
    }
    if (candidate) {
      throw ApiError.AlreadyExist('customer with this phone already exists');
    }
    const orderReceiver = await OrderReceiverModel.create(data);
    const orderReceiverDto = new OrderReceiverDto(orderReceiver);
    return { ...orderReceiverDto };
  }

  async updateOrderReceiver(id, data) {
    const candidate = await OrderReceiverModel.findOne({ phone: data.phone });
    if (candidate) {
      throw ApiError.AlreadyExist('customer with this phone already exists');
    }
    const orderReceiver = await OrderReceiverModel.findOneAndUpdate(id, data);
  }

  async deleteOrderReceiver(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.BadRequest('ID is incorrect');
    }
    const candidate = await OrderReceiverModel.findById(id);
    if (!candidate) {
      throw ApiError.NotFound('No user found');
    }
    const orderReceiver = await OrderReceiverModel.findByIdAndDelete(id);
  }

  async getOrderReceivers(customerID) {
    const orderReceiver = await OrderReceiverModel.find(
      { customerID },
      '-__v -createdAt -updatedAt'
    );
    return orderReceiver;
  }

  async getPrimaryOrderReceiver(id) {
    const customer = await CustomerModel.findById(id);
    if (!customer.primaryOrderReceiver) {
      throw ApiError.NotFound('No primary order receiver found');
    }
    const PrimaryOrderReceiver = OrderReceiverModel.findById(
      customer.primaryOrderReceiver,
      '-__v -createdAt -updatedAt'
    );
    return PrimaryOrderReceiver;
  }

  async createDeliveryAddress(data) {
    const candidate = data.flatNum
      ? await DeliveryAddressModel.findOne({
          city: data.city,
          street: data.street,
          houseNum: data.houseNum,
          flatNum: data.flatNum
        })
      : await DeliveryAddressModel.findOne({
          city: data.city,
          street: data.street,
          houseNum: data.houseNum
        });
    if (candidate) {
      throw ApiError.AlreadyExist('This delivery address already exists');
    }

    const deliveryAddress = await DeliveryAddressModel.create(data);
    const customer = await CustomerModel.findById(data.customerID);
    if (!customer.primaryDeliveryAddress) {
      await CustomerModel.findByIdAndUpdate(data.customerID, {
        primaryDeliveryAddress: deliveryAddress._id
      });
    }

    const deliveryAddressDto = new DeliveryAddressDto(deliveryAddress);
    return { ...deliveryAddressDto };
  }

  async updateDeliveryAddress(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.BadRequest('Invalid id');
    }
    const candidateID = await DeliveryAddressModel.findById(id);
    if (!candidateID) {
      throw ApiError.BadRequest(
        'A delivery address with this ID does not exist'
      );
    }
    const candidateAdr = await DeliveryAddressModel.findOne({
      city: data.city,
      street: data.street,
      houseNum: data.houseNum
    });
    if (candidateAdr) {
      throw ApiError.AlreadyExist('This delivery address already exists');
    }

    const deliveryAddress = await DeliveryAddressModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    const deliveryAddressDto = new DeliveryAddressDto(deliveryAddress);
    return { ...deliveryAddressDto };
  }

  async deleteDeliveryAddress(customerID, delAdrID) {
    if (!mongoose.Types.ObjectId.isValid(delAdrID)) {
      throw ApiError.BadRequest('Invalid id');
    }
    const candidate = await DeliveryAddressModel.findById(delAdrID);
    if (!candidate) {
      throw ApiError.BadRequest(
        'A delivery address with this ID does not exist'
      );
    }

    const deletedDeliveryAddress = await DeliveryAddressModel.findByIdAndDelete(
      delAdrID
    );
    const customer = await CustomerModel.findById(customerID);
    if (customer.primaryDeliveryAddress == delAdrID) {
      const deliveryAddress = await DeliveryAddressModel.find({
        customerID: customerID
      });
      const newPrimaryDeliveryAddressID = deliveryAddress.length
        ? deliveryAddress[0]._id
        : null;

      await CustomerModel.findByIdAndUpdate(customerID, {
        primaryDeliveryAddress: newPrimaryDeliveryAddressID
      });
    }
  }

  async getDeliveryAddress(CustomerID) {
    const deliveryAddress = await DeliveryAddressModel.find(
      { customerID: CustomerID },
      '-__v'
    );
    return deliveryAddress;
  }

  async getPrimaryDeliveryAddress(id) {
    const customer = await CustomerModel.findById(id);
    if (!customer.primaryDeliveryAddress) {
      throw ApiError.NotFound('No primary delivery address found');
    }
    const PrimaryDeliveryAddress = DeliveryAddressModel.findById(
      customer.primaryDeliveryAddress
    );
    return PrimaryDeliveryAddress;
  }
}

module.exports = new CustomerService();
