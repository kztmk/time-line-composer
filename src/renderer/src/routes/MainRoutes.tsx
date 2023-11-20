import { lazy } from 'react';

// project-imports
import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';
import AuthGuard from '../utils/route-guard/AuthGuard';
// render - sample page
const XListTable = Loadable(lazy(() => import('../pages/tables/XListTable')));
const AuthResetPassword = Loadable(lazy(() => import('../pages/auth/auth1/reset-password')));
// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <XListTable data={[]} />,
            },
          ],
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />,
        },
      ],
    },
    /*     {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: 'landing',
          element: <Landing />,
        },
      ],
    },
    {
      path: '/',
      element: <CommonLayout layout="simple" />,
      children: [
        {
          path: 'contact-us',
          element: <ContactUS />,
        },
      ],
    },
    {
      path: '/auth',
      element: <CommonLayout />,
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
          path: 'reset-password',
          element: <AuthResetPassword />,
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />,
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />,
        },
        {
          path: 'login2',
          element: <AuthLogin2 />,
        },
        {
          path: 'register2',
          element: <AuthRegister2 />,
        },
        {
          path: 'forgot-password2',
          element: <AuthForgotPassword2 />,
        },
        {
          path: 'reset-password2',
          element: <AuthResetPassword2 />,
        },
        {
          path: 'check-mail2',
          element: <AuthCheckMail2 />,
        },
        {
          path: 'code-verification2',
          element: <AuthCodeVerification2 />,
        },
        {
          path: 'login3',
          element: <AuthLogin3 />,
        },
      ],
    }, */
  ],
};

export default MainRoutes;
