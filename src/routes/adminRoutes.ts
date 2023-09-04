import { Router } from 'express';
import { AdminController, trackOrder } from '../controller/adminController';

const router = Router();

router.post('/signup', AdminController.createAdmin);
router.post('/submitLogin', AdminController.loginAdmin);
router.post('/logout',AdminController.logoutAdmin);
router.get('/track/:orderId',trackOrder);

export default router;