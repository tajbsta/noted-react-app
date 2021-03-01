import { lazy } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
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
