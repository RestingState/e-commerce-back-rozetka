const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CustomerSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  middleName: String,
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  birthday: String,
  sex: String,
  interfaceLanguage: String,
  additionalInfo: [String],
  isActivated: {
    type: Boolean,
    default: false
  },
  activationLink: {
    type: String
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  },
  primaryDeliveryAddress: {
    type: Schema.Types.ObjectId,
    ref: 'deliveryAddress'
  },
  primaryOrderReceiver: {
    type: Schema.Types.ObjectId,
    ref: 'orderReceiver'
  }
});

CustomerSchema.plugin(uniqueValidator);

module.exports = model('Customer', CustomerSchema);
