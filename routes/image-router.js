const Router = require('express');
const router = new Router();
const imageController = require('../controllers/image-controller');
const upload = require('../middlewares/image-upload-middleware');

router.post('/', upload.single('image'), imageController.uploadImage);
router.get('/:id', imageController.getImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
