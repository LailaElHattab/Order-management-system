const express = require('express');
const logger = require('../helpers/logger');
const { isEmpty, isValidObjectId, getPagingParams } = require('../helpers/utils');
const ProductModel = require('../model/product-model');

const router = express.Router();

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!isValidObjectId(productId)) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        const product = await ProductModel.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        res.status(200).json(toDto(product));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at get product', { error });
    }

});

router.get('/', async (req, res) => {

    try {
        const { limit, skip } = getPagingParams(req.query, res);
        if (skip === undefined || limit === undefined) return;
        const total = await ProductModel.countDocuments();
        const products = await ProductModel.find().sort({ name: 1 }).skip(skip).limit(limit);
        const result = {
            total,
            limit,
            skip,
            items: products.map(p => toDto(p)),
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at search product', { error });
    }

})

router.post('/', async (req, res) => {
    try {
        const { name, category, price } = req.body;
        if (!isProductValid(name, category, price, res)) return;

        const username = req.user?.username;
        const now = new Date();
        const product = await ProductModel.create({
            name,
            price,
            category,
            createdAt: now,
            createdBy: username,
            lastUpdatedAt: now,
            lastUpdatedBy: username
        });
        res.status(200).json(toDto(product));

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at create product', { error });
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!isValidObjectId(productId)) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        const { name, category, price } = req.body;
        if (!isProductValid(name, category, price, res)) return;

        const product = await ProductModel.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        product.name = name;
        product.category = category;
        product.price = price;
        product.lastUpdatedAt = new Date();
        product.lastUpdatedBy = req.user.username;
        await product.save();

        res.status(200).json(toDto(product));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        logger.error('Error at update product', { error });
    }
});

const toDto = (product) => {
    return {
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price
    }
}

const isProductValid = (name, category, price, res) => {
    if (isEmpty(name) || isEmpty(category)) {
        res.status(400).json({ message: 'Required data are missing!' });
        return false;
    }
    if (Number.isNaN(price) || price < 0) {
        res.status(400).json({ message: 'Price has invalid value!' });
        return false;
    }
    return true;
}

module.exports = router;