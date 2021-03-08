import { lazy } from 'react';
import AuthorizePage from '../pages/AuthorizePage';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ViewScanPage = lazy(() => import('../pages/ViewScanPage'));

export default [
  {
    path: '/request-permission',
    component: AuthorizePage,
    isSecured: true,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    isSecured: true,
  },
  {
    path: '/view-scan',
    component: ViewScanPage,
    isSecure: true,
  },
];
