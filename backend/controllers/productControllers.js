import asyncHanlder from 'express-async-handler';
import Product from '../models/Product.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHanlder(async (req, res) => {
    const products = await Product.find({});
    return res.json(products);
});

// @desc Fetch product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHanlder(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Delete product by id
// @route Delete /api/products/:id
// @access Private/ Admin
const deleteProduct = asyncHanlder(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json('Product Removed Successfully');
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Create product
// @route POST /api/products
// @access Private/ Admin
const createProduct = asyncHanlder(async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc update product
// @route POST /api/products/:id
// @access Private/ Admin
const updateProduct = asyncHanlder(async (req, res) => {
    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        product.description = description || product.description;
        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };