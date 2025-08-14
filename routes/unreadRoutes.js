import express from 'express';
import { markRoomAsRead, getUnreadCounts } from '../controllers/unreadController.js';

const router = express.Router();

// Mark a room as read for a user
router.post('/markRead', markRoomAsRead);

// Get unread counts for all user's rooms
router.get('/counts', getUnreadCounts);

export default router;
