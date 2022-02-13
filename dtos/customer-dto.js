module.exports = class CustomerDto {
  id;

  constructor(model) {
    this.id = model._id;
  }
};
