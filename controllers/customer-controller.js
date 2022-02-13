const customerService = require('../service/customer-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class CustomerController {
  async registration(req, res, next) {
    try {
      const data = req.body;
      const customerData = await customerService.registration(data);
      res.cookie('refreshToken', customerData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return res.status(201).json(customerData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const data = req.body;
      const customerData = await customerService.login(data);
      res.cookie('refreshToken', customerData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return res.json(customerData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await customerService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.json({ message: 'customer logged out' });
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await customerService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const customerData = await customerService.refresh(refreshToken);
      res.cookie('refreshToken', customerData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return res.json(customerData);
    } catch (e) {
      next(e);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      const id = req.user.id;
      const { refreshToken } = req.cookies;
      const response = await customerService.deleteCustomer(id, refreshToken);
      if (!response) {
        return next(ApiError.NotFound('customer was not found'));
      }
      return res.status(200).json({ message: 'customer deleted' });
    } catch (e) {
      next(e);
    }
  }

  async getPersonalInfo(req, res, next) {
    try {
      const id = req.user.id;
      const customer = await customerService.getCustomerPersonalInfo(id);
      return res.json(customer);
    } catch (e) {
      next(e);
    }
  }

  async updatePersonalInfo(req, res, next) {
    try {
      const id = req.user.id;
      const data = req.body;
      const customerData = await customerService.updateCustomer(id, data);
      return res.status(200).json({ customerData });
    } catch (e) {
      next(e);
    }
  }

  async createOrderReceiver(req, res, next) {
    try {
      const data = req.body;
      const id = req.user.id;
      data.customerID = id;
      const customerData = await customerService.createOrderReceiver(data);
      return res.status(201).json(customerData);
    } catch (e) {
      next(e);
    }
  }

  async updateOrderReceiver(req, res, next) {
    try {
      const id = req.user.id;
      const data = req.body;
      const customerData = await customerService.updateOrderReceiver(id, data);
      return res.status(200).json(customerData);
    } catch (e) {
      next(e);
    }
  }

  async deleteOrderReceiver(req, res, next) {
    try {
      const id = req.params.id;
      const deleteOrderReceiver = await customerService.deleteOrderReceiver(id);
      return res.status(200).json(deleteOrderReceiver);
    } catch (e) {
      next(e);
    }
  }

  async getOrderReceivers(req, res, next) {
    try {
      const customerid = req.user.id;
      const GetOrderReceivers = await customerService.getOrderReceivers(
        customerid
      );
      return res.status(200).json(GetOrderReceivers);
    } catch (e) {
      next(e);
    }
  }

  async getPrimaryOrderReceiver(req, res, next) {
    try {
      const id = req.user.id;
      const GetPrimaryOrderReceiver =
        await customerService.getPrimaryOrderReceiver(id);
      return res.status(200).json(GetPrimaryOrderReceiver);
    } catch (e) {
      next(e);
    }
  }

  async createDeliveryAddress(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const data = req.body;
      data.customerID = req.user.id;
      const Data = await customerService.createDeliveryAddress(data);
      return res.status(201).json(Data);
    } catch (e) {
      next(e);
    }
  }

  async updateDeliveryAddress(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const id = req.params.id;
      const data = req.body;
      const Data = await customerService.updateDeliveryAddress(id, data);
      return res.status(200).json(Data);
    } catch (e) {
      next(e);
    }
  }

  async deleteDeliveryAddress(req, res, next) {
    try {
      const delAdrID = req.params.id;
      const customerID = req.user.id;
      const deletedDeliveryAddress =
        await customerService.deleteDeliveryAddress(customerID, delAdrID);
      return res
        .status(200)
        .json('Delivery address had beed successfully deleted');
    } catch (e) {
      next(e);
    }
  }

  async getDeliveryAddress(req, res, next) {
    try {
      const id = req.user.id;
      const GetDeliveryAddress = await customerService.getDeliveryAddress(id);
      return res.status(200).json(GetDeliveryAddress);
    } catch (e) {
      next(e);
    }
  }

  async getPrimaryDeliveryAddress(req, res, next) {
    try {
      const id = req.user.id;
      const GetPrimaryDeliveryAddress =
        await customerService.getPrimaryDeliveryAddress(id);
      return res.status(200).json(GetPrimaryDeliveryAddress);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CustomerController();
