import { lazy } from 'react';
import AuthorizePage from '../pages/AuthorizePage';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ViewScanPage = lazy(() => import('../pages/ViewScanPage'));
const ScanningPage = lazy(() => import('../pages/ScanningPage'));

export default [
  {
    path: '/request-permission',
    component: AuthorizePage,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
  },
  {
    path: '/view-scan',
    component: ViewScanPage,
  },
  { path: '/scanning', component: ScanningPage },
];
