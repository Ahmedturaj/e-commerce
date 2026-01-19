import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import productRoutes from '../modules/product/product.routes';
import paymentRoute from '../modules/payment/payment.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/payment',
    route: paymentRoute,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
