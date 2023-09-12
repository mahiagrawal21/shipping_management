import { Router } from 'express';
import { AdminController, trackOrder } from '../controller/adminController';
import {
    signupSchema,
    loginSchema
} from '../controller/adminController';
const router = Router();
import { validateJoiSchema } from '../middlewares/joivalidation';

router.post('/signup',validateJoiSchema(signupSchema), AdminController.createAdmin);
router.post('/submitLogin',validateJoiSchema(loginSchema), AdminController.loginAdmin);
router.post('/logout',AdminController.logoutAdmin);
router.get('/track/:orderId',trackOrder);

export default router;