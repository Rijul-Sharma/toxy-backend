import express from 'express'
import { deleteAccount, getUser, getUserIcon, updateUserName } from '../controllers/userController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.use(verifyToken)

router.get('/', getUser)
router.get('/icon', getUserIcon)
router.post('/updateName', updateUserName)
router.delete('/delete', deleteAccount)

export default router