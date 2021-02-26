import { lazy } from "react";
import iRoutes from "../models/iRoutes";

const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const AuthorizePage = lazy(() => import("../pages/AuthorizePage"));

const routes: Array<iRoutes> =
  [
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

export default routes;