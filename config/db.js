const mongoose = require('mongoose');

module.exports = async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    await mongoose.connect(process.env.DB_URL, connectionParams);
    console.log('connected to database');
  } catch (e) {
    console.log(error);
    console.log('could not connect to database');
  }
};
