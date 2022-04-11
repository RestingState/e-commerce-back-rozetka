const Router = require('express');
const router = new Router();
const customerRouter = require('./customer-router');
const categoryRouter = require('./category-router');
const imageRouter = require('./image-router');

router.use('/customer', customerRouter);
router.use('/category', categoryRouter);
router.use('/image', imageRouter);

module.exports = router;
