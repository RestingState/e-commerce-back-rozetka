module.exports = class OrderReceiverDto {
  id;

  constructor(model) {
    this.id = model._id;
  }
};
