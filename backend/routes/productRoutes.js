import express from 'express';
import asyncHanlder from 'express-async-handler';
import Product from '../models/Product.js';
const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/', asyncHanlder(async (req, res) => {
    const products = await Product.find({});
    return res.json(products);
}));
// @desc Fetch product by id
// @route GET /api/products/:id
// @access Public
router.get('/:id', asyncHanlder(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
}));

export default router;