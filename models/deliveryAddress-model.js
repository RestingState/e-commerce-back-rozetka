const { Schema, model } = require('mongoose');

const deliveryAddressShema = {
  customerID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  houseNum: {
    type: Number,
    required: true,
  },
  flatNum: {
    type: Number,
  },
};

module.exports = model('deliveryAddress', deliveryAddressShema);
