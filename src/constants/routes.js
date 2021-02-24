import { lazy } from "react";

const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const AuthorizePage = lazy(() => import("../pages/AuthorizePage"));

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
    path: "/request-permission",
    component: AuthorizePage,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
  },
];
