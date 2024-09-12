import Router from 'express'
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/verifyJWT.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router=Router()


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/current-user').post(verifyJWT,getCurrentUser)
export default router