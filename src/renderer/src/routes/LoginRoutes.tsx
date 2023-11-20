import { lazy } from 'react';

// project-imports
import Loadable from '../components/Loadable';
import CommonLayout from '../layout/CommonLayout';
import GuestGuard from '../utils/route-guard/GuestGuard';
// render - login
const AuthLogin = Loadable(lazy(() => import('../pages/auth/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('../pages/auth/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('../pages/auth/auth1/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('../pages/auth/auth1/check-mail')));

// ==============================|| AUTH ROUTES ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: 'login',
          element: <AuthLogin />,
        },
        {
          path: 'register',
          element: <AuthRegister />,
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />,
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />,
        },
      ],
    },
  ],
};

export default LoginRoutes;
