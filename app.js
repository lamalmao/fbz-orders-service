const config = require('dotenv').config().parsed;
const express = require('express');
const mongoose = require('mongoose');
const ordersRouter = require('./routers/orders');
const cors = require('cors');

const app = express();

(async () => {
  if (!config) {
    console.error('Не найден файл настроек .env');
    process.exit(-1);
  }

  await mongoose.connect(config.DB);
  console.log('Database connected');

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/orders', ordersRouter);

  app.listen(config.PORT, () =>
    console.log(`HTTP server started at port ${config.PORT}`)
  );
})();
