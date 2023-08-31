import { Router } from 'express';
import { AdminController } from '../controller/adminController';

const router = Router();

router.post('/signup', AdminController.createAdmin);
router.post('/submitLogin', AdminController.loginAdmin);
router.post('/logout',AdminController.logoutAdmin);

export default router;