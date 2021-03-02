import { lazy } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthorizePage from "../pages/AuthorizePage";
import ViewScanPage from "../pages/ViewScanPage";

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
