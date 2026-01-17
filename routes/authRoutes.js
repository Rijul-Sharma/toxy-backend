import express from 'express'
import { Signup, Login, getCurrentUser, refreshAccessToken, logout } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/me', verifyToken, getCurrentUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)

export default router