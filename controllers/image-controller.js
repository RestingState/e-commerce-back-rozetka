const imageService = require('../service/image-service');
const ApiError = require('../exceptions/api-error');

class ImageController {
  uploadImage(req, res, next) {
    try {
      res
        .status(201)
        .json({ img_url: `${process.env.API_URL}/api/image/${req.file.id}` });
    } catch (e) {
      next(e);
    }
  }

  getImage(req, res, next) {
    try {
      const imageId = req.params.id;
      const readStream = imageService.getImage(imageId);
      readStream.pipe(res);
    } catch (e) {
      next(e);
    }
  }

  deleteImage(req, res, next) {
    try {
      const imageId = req.params.id;
      imageService.deleteImage(imageId);
      res.status(200).json({ message: 'image has been deleted' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ImageController();
