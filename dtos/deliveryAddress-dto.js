module.exports = class DeliveryAdressDto {
    id;
 
    constructor(model) {
        this.id = model._id;
        this.city = model.city;
        this.street = model.street;
        this.houseNum = model.houseNum;
        this.flatNum = model.flatNum;
    }
};