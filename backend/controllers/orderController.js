import asyncHanlder from 'express-async-handler';
import Order from '../models/Order.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHanlder(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });
        const createdOrder = await order.save();
        res.status(200).json(createdOrder);
    }
});

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHanlder(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHanlder(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.ispaid = true,
            order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body._id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        };
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc Get logged in user order
// @route GET /api/orders/myOrders
// @access Private
const getMyOrders = asyncHanlder(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
