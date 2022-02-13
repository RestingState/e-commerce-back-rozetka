const Router = require('express');
const router = new Router();
const customerController = require('../controllers/customer-controller');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const validateDto = require('../middlewares/validate-dto');
const { registerValidation, loginValidation } = require('../schemas/customer');

router.post(
  '/registration',
  validateDto(registerValidation),
  customerController.registration
);
router.post('/login', validateDto(loginValidation), customerController.login);
router.post('/logout', authMiddleware, customerController.logout);
router.get('/activate/:link', customerController.activate);
router.get('/refresh', customerController.refresh);
router.delete('', authMiddleware, customerController.deleteCustomer);
router.get('/personalInfo', authMiddleware, customerController.getPersonalInfo);
router.patch(
  '/personalInfo',
  authMiddleware,
  customerController.updatePersonalInfo
);
router.post(
  '/createOrderReceiver',
  authMiddleware,
  customerController.createOrderReceiver
);
router.patch(
  '/updateOrderReceiver/:id',
  authMiddleware,
  customerController.updateOrderReceiver
);
router.delete(
  '/deleteOrderReceiver/:id',
  authMiddleware,
  customerController.deleteOrderReceiver
);
router.get(
  '/getOrderReceivers/:id',
  authMiddleware,
  customerController.getOrderReceivers
);
router.get(
  '/orderReceiver/primary',
  authMiddleware,
  customerController.getPrimaryOrderReceiver
);
router.post(
  '/DeliveryAddress',
  authMiddleware,
  body('houseNum').isNumeric(),
  body('flatNum').if(body('flatNum').exists()).isNumeric(),
  customerController.createDeliveryAddress
);
router.patch(
  '/DeliveryAddress/:id',
  authMiddleware,
  body('houseNum').if(body('houseNum').exists()).isNumeric(),
  body('flatNum').if(body('flatNum').exists()).isNumeric(),
  customerController.updateDeliveryAddress
);
router.delete(
  '/DeliveryAddress/:id',
  authMiddleware,
  customerController.deleteDeliveryAddress
);
router.get(
  '/DeliveryAddress/primary',
  authMiddleware,
  customerController.getPrimaryDeliveryAddress
);
router.get(
  '/DeliveryAddresses',
  authMiddleware,
  customerController.getDeliveryAddress
);

module.exports = router;
