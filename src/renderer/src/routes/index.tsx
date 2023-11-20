import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// project-imports
import Loadable from '../components/Loadable';
import CommonLayout from '../layout/CommonLayout';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('../pages/landing')));

// ==============================|| ROUTES RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: '/',
          element: <PagesLanding />,
        },
      ],
    },
    LoginRoutes,
    MainRoutes,
  ]);
}