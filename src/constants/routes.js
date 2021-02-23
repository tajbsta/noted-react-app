import { lazy } from "react";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const AuthorizePage = lazy(() => import("../pages/AuthorizePage"));

export default [
  {
    path: "/",
    component: LandingPage,
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
