import { lazy } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AuthorizePage from "../pages/AuthorizePage";
import ViewScanPage from "../pages/ViewScanPage";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const Code = lazy(() => import("../pages/Code"));

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
    path: "/code",
    component: Code,
  },
  {
    path: "/request-permission",
    component: AuthorizePage,
    isSecured: true,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    // isSecured: true
  },
  {
    path: "/view-scan",
    component: ViewScanPage,
    // isSecure: true
  },
];
