import { lazy } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AuthorizePage from "../pages/AuthorizePage";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));

export default [
  {
    path: "/",
    component: RegisterPage,
  },
  {
    path: "/join",
    component: RegisterPage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
  },
  {
    path: "/reset-password",
    component: ResetPasswordPage,
  },
  {
    path: "/request-permission",
    component: AuthorizePage,
    isSecured: true
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    isSecured: true
  },
];
