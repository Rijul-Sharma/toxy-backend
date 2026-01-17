import express from 'express';
import { markRoomAsRead, getUnreadCounts } from '../controllers/unreadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router();


router.use(verifyToken)

// Mark a room as read for a user
router.post('/markRead', markRoomAsRead);

// Get unread counts for all user's rooms
router.get('/counts', getUnreadCounts);

export default router;
