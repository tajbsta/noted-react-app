import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import Code from '../pages/Code';

export default [
  {
    path: '/',
    component: RegisterPage,
  },
  {
    path: '/join',
    component: RegisterPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage,
  },
  {
    path: '/code',
    component: Code,
  },
  {
    path: '/code/verify',
    component: Code,
  }
];
