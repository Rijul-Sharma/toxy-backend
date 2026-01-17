import express from 'express'
import { getAllMessages, saveMessage } from '../controllers/messageController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.use(verifyToken)

router.get('/', getAllMessages)
router.post('/save', saveMessage)
    
export default router