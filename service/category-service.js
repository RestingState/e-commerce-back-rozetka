const CategoryModel = require('../models/category-model');

class CategoryService {
  async getCategories(ids) {
    const categories = await CategoryModel.find({ _id: { $in: ids } });
    return categories;
  }
}

module.exports = new CategoryService();
