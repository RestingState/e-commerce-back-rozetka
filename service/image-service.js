const mongoose = require('mongoose');

var gridfsBucket;
mongoose.connection.on('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: 'images'
  });
});

class ImageService {
  getImage(imageId) {
    const readStream = gridfsBucket.openDownloadStream(
      mongoose.Types.ObjectId(imageId)
    );
    return readStream;
  }

  deleteImage(imageId) {
    gridfsBucket.delete(mongoose.Types.ObjectId(imageId));
  }
}

module.exports = new ImageService();
