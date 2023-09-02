const express = require('express');
const orderId = require('order-id')('key');
const dateFns = require('date-fns');
const logger = require('../helpers/logger');
const { isEmpty, isValidObjectId, getPagingParams } = require('../helpers/utils');
const OrderModel = require('../model/order-model');
const ProductModel = require('../model/product-model');
const { sendNotification } = require('./event-controller');
const router = express.Router();

router.get('/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (!isValidObjectId(orderId)) {
            return res.status(404).json({ message: 'Order not found!' });
        }
        const order = await OrderModel.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found!' });
        }
        res.status(200).json(await toDto(order));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at get order', { error });
    }

});

router.get('/', async (req, res) => {

    try {
        const { limit, skip } = getPagingParams(req.query, res);
        if (skip === undefined || limit === undefined) return;

        const { dateFrom, dateTo, amountFrom, amountTo } = req.query;

        const query = {};
        if (dateFrom && dateTo) {
            const fromDate = dateFns.parseISO(dateFrom);
            const toDate = dateFns.parseISO(dateTo);
            if (!dateFns.isValid(fromDate) || !dateFns.isValid(toDate) || dateFns.isBefore(toDate, fromDate)) {
                return res.status(400).json({ message: 'Invalid date range!' });
            }
            query['date'] = { $gte: fromDate, $lt: toDate }
        }

        let amountFromVal = undefined;
        if (amountFrom) {
            amountFromVal = Number(amountFrom);
            if (Number.isNaN(amountFromVal)) {
                return res.status(400).json({ message: 'Invalid amountFrom value!' });
            }
        }
        let amountToVal = undefined;
        if (amountTo) {
            amountToVal = Number(amountTo);
            if (Number.isNaN(amountToVal) || (amountFromVal && amountToVal < amountFromVal)) {
                return res.status(400).json({ message: 'Invalid amountTo value!' });
            }
        }
        if (amountFromVal && amountToVal) {
            query['totalAmount'] = { $gte: amountFromVal, $lt: amountToVal }
        } else if (amountFromVal) {
            query['totalAmount'] = { $gte: amountFromVal }
        } else if (amountToVal) {
            query['totalAmount'] = { $lt: amountToVal };
        }


        const total = await OrderModel.countDocuments(query);
        const orders = await OrderModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

        const result = {
            total,
            limit,
            skip,
            items: orders.map(o => toSummaryDto(o)),
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at search order', { error });
    }

});

router.post('/', async (req, res) => {
    try {
        const { customerName } = req.body;
        if (isEmpty(customerName)) {
            res.status(400).json({ message: 'customerName is missing!' });
            return null;
        }
        const payload = await validateOrder(req.body, res);
        if (!payload) return;
        const username = req.user.username;
        const now = new Date();
        const order = await OrderModel.create({
            number: orderId.generate(),
            date: now,
            customerName,
            ...payload,
            createdAt: now,
            createdBy: username,
            lastUpdatedAt: now,
            lastUpdatedBy: username
        });
        res.status(200).json(await toDto(order));
        sendNotification('new-order', dto, username);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at create order', { error });
    }
});

router.put('/:orderId', async (req, res) => {
    try {

        const orderId = req.params.orderId;
        if (!isValidObjectId(orderId)) {
            return res.status(404).json({ message: 'Order not found!' });
        }
        const payload = await validateOrder(req.body.updatedOrderData, res);
        if (!payload) return;

        const order = await OrderModel.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found!' });
        }
        order.products = payload.products;
        order.itemsSubTotal = payload.itemsSubTotal;
        order.shippingCost = payload.shippingCost;
        order.shippingStatus = payload.shippingStatus;
        order.taxCost = payload.taxCost;
        order.totalAmount = payload.totalAmount;
        order.lastUpdatedAt = new Date();
        order.lastUpdatedBy = req.user.username;
        await order.save();
        res.status(200).json(await toDto(order));
        sendNotification('update-order', dto, username);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at update order', { error });
    }
});
router.delete('/:orderId', async (req, res) => {
    try {

        const orderId = req.params.orderId;
        if (!isValidObjectId(orderId)) {
            return res.status(404).json({ message: 'Order not found!' });
        }

        const order = await OrderModel.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found!' });
        }

        await order.deleteOne();
        res.status(200).json(await toDto(order));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at update order', { error });
    }
});
const toSummaryDto = (order) => {
    return {
        id: order._id,
        number: order.number,
        date: order.date,
        customerName: order.customerName,
        productsCount: order.products.length,
        itemsSubTotal: order.itemsSubTotal,
        shippingCost: order.shippingCost,
        shippingStatus: order.shippingStatus,
        taxCost: order.taxCost,
        totalAmount: order.totalAmount,
    }
}

const toDto = async (order) => {
    const productIds = order.products.map(p => p.id);
    const records = await ProductModel.find({ _id: { $in: productIds } });
    const products = order.products.map(p => {
        const record = records.find(r => r._id.toString() === p.id);
        return {
            id: p.id,
            name: record.name,
            category: record.category,
            unitPrice: p.unitPrice,
            quantity: p.quantity,
        }
    });
    return {
        id: order._id,
        number: order.number,
        date: order.date,
        customerName: order.customerName,
        products: products,
        itemsSubTotal: order.itemsSubTotal,
        shippingCost: order.shippingCost,
        shippingStatus: order.shippingStatus,
        taxCost: order.taxCost,
        totalAmount: order.totalAmount,
    }
}

const validateOrder = async (payload, res) => {
    const { products, shippingStatus, shippingCost, taxCost } = payload;

    if (Number.isNaN(shippingCost) || shippingCost < 0) {
        res.status(400).json({ message: 'shippingCost has invalid value!' });
        return null;
    }
    if (Number.isNaN(taxCost) || taxCost < 0) {
        res.status(400).json({ message: 'taxCost has invalid value' });
        return null;
    }
    if (!products || !Array.isArray(products)) {
        res.status(400).json({ message: 'products has invalid value' });
        return null;
    }

    let itemsSubTotal = 0.0;
    const items = [];
    for (const prodLine of products) {
        const productId = prodLine.id;
        if (!productId || !isValidObjectId(productId)) {
            res.status(400).json({ message: `Product ${productId} not found!` });
            return null;
        }
        const dbProduct = await ProductModel.findOne({ _id: productId });
        if (!dbProduct) {
            res.status(400).json({ message: `Product ${productId} not found!` });
            return null;
        }

        if (!prodLine.quantity || !Number.isInteger(prodLine.quantity)) {
            res.status(400).json({ message: `Invalid quantity for Product ${productId}` });
            return null;
        }

        items.push({
            id: productId,
            quantity: prodLine.quantity,
            unitPrice: dbProduct.price,
        })
        itemsSubTotal += dbProduct.price * prodLine.quantity;
    }
    const totalAmount = itemsSubTotal + shippingCost + taxCost;

    return {
        products: items,
        itemsSubTotal,
        shippingCost,
        shippingStatus,
        taxCost,
        totalAmount
    }
}

module.exports = router;