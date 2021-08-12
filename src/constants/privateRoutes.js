import AuthorizePage from '../pages/AuthorizePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import { CheckoutPage } from '../pages/Order/CheckoutPage';
import { ViewOrderPage } from '../pages/Order/ViewOrderPage';
import DashboardPageInitial from '../pages/Dashboard/DashboardPageInitial';
// import EditOrderPage from '../pages/EditOrder/EditOrder';

export default [
  { path: '/request-permission', component: AuthorizePage },
  { path: '/dashboard', component: DashboardPageInitial },
  { path: '/checkout', component: CheckoutPage },
  { path: '/profile', component: ProfilePage },
  { path: '/settings', component: SettingsPage },
  { path: '/order/:id', component: ViewOrderPage },
  // { path: '/edit-order', component: EditOrderPage },
];
