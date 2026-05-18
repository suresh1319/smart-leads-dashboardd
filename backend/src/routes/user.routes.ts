// src/routes/user.routes.ts
import { Router } from 'express';
import { User } from '../models/User';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { Response, NextFunction } from 'express';

const router = Router();

// All routes require admin
router.use(authenticate, authorize('admin'));

// GET /api/users - Admin: list all users
router.get('/', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Admin: delete user
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.userId === req.params.id) {
      sendError(res, 'Cannot delete your own account', 400);
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
