const Router = require('express');
const router = new Router();
const customerRouter = require('./customer-router');
const imageRouter = require('./image-router');

router.use('/customer', customerRouter);
router.use('/image', imageRouter);

module.exports = router;
