const express = require('express');

const authMiddleware = require('../middleware/auth-middleware');
const authRoute = require('./auth-controller');
const profileRoute = require('./profile-controller');
const userRoute = require('./user-controller');
const orderRoute = require('./order-controller');
const productRoute = require('./product-controller');
const { router: eventRoute } = require('./event-controller');

const router = express.Router();
router.use(authRoute);
router.use(authMiddleware);
router.use('/profile', profileRoute);
router.use('/users', userRoute);
router.use('/orders', orderRoute);
router.use('/products', productRoute);
router.use('/events', eventRoute);
module.exports = router;