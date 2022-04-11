const ApiError = require('../exceptions/api-error');
const categoryService = require('../service/category-service');
const { convertToArray } = require('../utils/category');

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const stringOfIds = req.query.ids;
      if (!stringOfIds) {
        return next(ApiError.BadRequest('no ids were provided'));
      }
      const ids = convertToArray(stringOfIds);
      const categories = await categoryService.getCategories(ids);
      return res.status(200).json(categories);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController();
