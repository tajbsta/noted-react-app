import { lazy } from 'react';
import AuthorizePage from '../pages/AuthorizePage';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ViewScanPage = lazy(() => import('../pages/ViewScanPage'));
const ScanningPage = lazy(() => import('../pages/ScanningPage'));

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
  { path: '/scanning', component: ScanningPage, isSecured: true },
];
