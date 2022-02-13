const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const storage = new GridFsStorage({
  url: process.env.DB_URL,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return {
        bucketName: 'images'
      };
    } else {
      return null;
    }
  }
});
module.exports = multer({ storage });
