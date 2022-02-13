const app = require('./config/app');

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
