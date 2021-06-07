import AuthorizePage from '../pages/AuthorizePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import { CheckoutPage } from '../pages/Order/CheckoutPage';
import { ViewOrderPage } from '../pages/Order/ViewOrderPage';
// import EditOrderPage from '../pages/EditOrder/EditOrder';

export default [
  { path: '/request-permission', component: AuthorizePage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/checkout', component: CheckoutPage },
  { path: '/profile', component: ProfilePage },
  { path: '/settings', component: SettingsPage },
  { path: '/order/:id', component: ViewOrderPage },
  // { path: '/edit-order', component: EditOrderPage }, 
];
