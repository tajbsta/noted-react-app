import { lazy } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import Code from '../pages/Code';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const AuthorizePage = lazy(() => import('../pages/AuthorizePage'));
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
