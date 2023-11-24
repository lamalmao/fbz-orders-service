const express = require('express');
const authController = require('../controllers/auth');
const getOrdersController = require('../controllers/get-orders');

const ordersRouter = express.Router();

ordersRouter.post('/get', authController, getOrdersController);

module.exports = ordersRouter;
