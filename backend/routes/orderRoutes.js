import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.route('/myOrders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);



export default router;