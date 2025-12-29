import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  assignDelivery,
  getAvailableOrders,
  takeOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/available', protect, authorize('repartidor'), getAvailableOrders);

router
  .route('/:id')
  .get(protect, getOrder);

router.put('/:id/status', protect, authorize('admin', 'repartidor'), updateOrderStatus);
router.put('/:id/assign', protect, authorize('admin'), assignDelivery);
router.put('/:id/take', protect, authorize('repartidor'), takeOrder);

export default router;
