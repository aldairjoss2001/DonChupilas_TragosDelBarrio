import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

export default router;
