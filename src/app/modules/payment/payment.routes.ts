import { Router } from 'express';
import {
  createPayment,
  confirmPayment,
} from './payment.controller';
import { userRole } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create-payment', auth(userRole.user), createPayment);
router.post('/confirm-payment', confirmPayment);

const paymentRoute = router;
export default paymentRoute;
