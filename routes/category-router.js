const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/category-controller');

router.get('/types', categoryController.getCategories);

module.exports = router;
