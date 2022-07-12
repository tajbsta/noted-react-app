import AuthorizePage from '../pages/AuthorizePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import { SettingsPageWrapper } from '../pages/Settings/SettingsPage';
import { VendorsPage } from '../pages/Vendors/VendorsPage';
import { CheckoutPage } from '../pages/Order/CheckoutPage';
import { ViewOrderPage } from '../pages/Order/ViewOrderPage';
import { DashboardPageInitialWrapper } from '../pages/Dashboard/DashboardPageInitial';
// import EditOrderPage from '../pages/EditOrder/EditOrder';

export default [
  { path: '/request-permission', component: AuthorizePage },
  { path: '/dashboard', component: DashboardPageInitialWrapper },
  { path: '/checkout', component: CheckoutPage },
  { path: '/profile', component: ProfilePage },
  { path: '/settings', component: SettingsPageWrapper },
  { path: '/vendors', component: VendorsPage },
  { path: '/order/:id', component: ViewOrderPage },
  // { path: '/edit-order', component: EditOrderPage },
];
